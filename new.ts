import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Channel, ChatInputCommandInteraction, Client, EmbedBuilder, Interaction, Message, MessageComponentInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, TextChannel } from "discord.js";
import { DO } from "./data/DOBuilder"
import { QuestionChannelI } from "./data/data_interfaces/questionChannel";
import { GameInteractionErr } from "./Errors";
import { BCONST } from "./BCONST";
import { DropdownItem } from "./data/component_interfaces/dropdown_item";
import { QuestionO } from "./data/data_objects/question";
import { AskedQuestionO } from "./data/data_objects/askedQuesetion";
import { PlayerAnswerI } from "./data/data_interfaces/playerAnswer";
import { AskedQuestionI } from "./data/data_interfaces/askedQuestion";
import { PlayerAnswerO } from "./data/data_objects/playerAnswer";
import { showQuestionResult } from "./question_cycle";
import { PlayerI } from "./data/data_interfaces/player";
import { ShuffledAnswerItem } from "./data/component_interfaces/shuffled_answer";
import { QuestionChannelO } from "./data/data_objects/questionChannel";
import { gameStillActive } from "./end";


export async function createNewGame(interaction: ChatInputCommandInteraction): Promise<Number> {
    let result = 0;
    let channelId: string;
    let channel = interaction.options.getChannel(`chosenChannel`);
    if (!channel) {
        channelId = interaction.channelId; 
    }
    else {
        channelId = channel.id;
    }
    let serverId = interaction.guildId;
    if (serverId == null) result = GameInteractionErr.GuildDataUnavailable;

    // is there an existing game for this channel?
    let existingGame = await DO.getQuestionChannel(channelId);
    let updateGame: QuestionChannelO | null = null;
    if (existingGame.length > 0) {
        for (let i=0; i < existingGame.length; i++) {
            let qch = existingGame[i];
            if (qch.getOwner().length < 1) {
                qch.setOwner(interaction.user.id);
                qch.setChannel(channelId);
                result = await DO.updateQuestionChannel(qch, result);
                let games = await DO.getQuestionChannel(qch.getChannel());
                for (let j=0; j < games.length; j++) {
                    if (games[j].getChannel() == channelId && games[j].getOwner() == interaction.user.id) {
                        updateGame = games[j];
                    }
                }
                break;
            }
        }
    }
    

    // create new game
    if (!result && existingGame.length <= 0) {
        
        const d = new Date();
        let time = d.getTime();

        // register channel
        let newQuestionChannel: QuestionChannelI = {
            qch_id: 0,
            server:  interaction.guildId,
            channel: channelId,
            owner: interaction.user.id,
            date: time,
            question: 0
        };
        result = await DO.insertQuestionChannel(newQuestionChannel);
        
        if (result) {
            result = GameInteractionErr.SQLConnectionError;
        }
        else {
            let thumbnail = BCONST.MAXIMUS_IMAGES[Math.floor(Math.random()*BCONST.MAXIMUS_IMAGES.length)].url;
            const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
            embed.setTitle('**New Trivia Game**');
            let description = `This is the beginning of a new trivia game! This game is specific to this channel in this server.\
            Every 24-48 hours, a new question will be asked. All participants in the channel have the next 23 hours to provide their answer to the question.\
            \nYou can also add new trivia to the pool! Try it yourself with the \`/add\` command.`;
            embed.setDescription(description);
            interaction.editReply({ embeds:[embed]});

            // create the new question
            createNewQuestion(serverId!!, channelId, interaction.client);
        }
    }
    else if (updateGame != null) {
        let thumbnail = BCONST.MAXIMUS_IMAGES[Math.floor(Math.random()*BCONST.MAXIMUS_IMAGES.length)].url;
        const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
        embed.setTitle('**Continued Trivia Game**');
        let description = `This is the continuation of a previously closed trivia game! This game is specific to this channel in this server.\
        Every 24-48 hours, a new question will be asked. All participants in the channel have the next 23 hours to provide their answer to the question.\
        \nYou can also add new trivia to the pool! Try it yourself with the \`/add\` command.`;
        embed.setDescription(description);
        interaction.editReply({ embeds:[embed]});

        // create the new question
        createNewQuestion(serverId!!, channelId, interaction.client);
    }
    else {
        result = GameInteractionErr.GameAlreadyExists;
    }
    return result;
}

export async function canInitiateNewGame(interaction: ChatInputCommandInteraction): Promise<Number> {
    let result: number = 0;
    let channelId: string;
    let channel = interaction.options.getChannel(`chosenChannel`);
    if (!channel) {
        channelId = interaction.channelId; 
    }
    else {
        channelId = channel.id;
    }
    let serverId = interaction.guildId;

    // is there an existing game for this channel?
    console.log("Identified Channel: ", channelId);
    console.log("Identified Server: ", serverId);

    if (!serverId) {
        result = GameInteractionErr.GuildDataUnavailable;
    }
    else {
        let existingGame = await DO.getQuestionChannelByServer(serverId);
        if (existingGame.length <= 0) {
            return 0
        }
        else {
            for (let i=0; i < existingGame.length; i++) {
                let qch = existingGame[i];
                // if a channel exists, see if it has an owner
                if (qch.getOwner().length > 0) {
                    result = GameInteractionErr.GameAlreadyExistsInServer;
                }
                else {
                    // update the abanndoned game to this channel
                    result = 0;
                }
            }
        }
    }
    return result;
}

export async function createNewQuestion(serverID: string, channelID: string, client: Client, selected_question: number=-1, prev_question_time_remaining: number=-1): Promise<Number> {
    let result = 0;
    let question: QuestionO;
    let question_id: number;

    // check if the game is still active
    if (!(await gameStillActive(channelID))) {
        result = GameInteractionErr.GameDoesNotExist;
    }

    // are we in the lead/master server?
    if (selected_question >= 0) {
        let question_attempt = await DO.getQuestion(selected_question);
        if (question_attempt) {
            question = question_attempt;
            question_id = question.getQuestionID();
        }
        else {
            result = GameInteractionErr.QuestionDoesNotExist;
        }
    }
    else if (serverID == BCONST.MASTER_QUESTION_SERVER) {
        
        let unused_questions = await DO.getUnusedQuestions();
        let rand = Math.floor(Math.random()*unused_questions.length);
        question = unused_questions[rand];

        console.log(`Selected question: [${question.getQuestionID()}][${question.getQuestion()}]`);

        question_id = question.getQuestionID();
        
    }
    else {
        // TODO this is untested

        // choose a random question that has already been asked in the master server,
        // but hasn't been asked in this server.

        let used_questions = await DO.getUsedQuestions();

        // choose a random question that hasn't been asked in this server yet.
        let count_max = 20;
        let count = 0;
        let new_question = false;
        while (!new_question && count < count_max) {
            let i = Math.floor(Math.random()*used_questions.length);
            question = used_questions[i];
            question_id = question.getQuestionID();
            let q = await DO.getAskedQuestion(question_id, channelID);
            if (q.length < 1) {
                new_question = true;
            }
            else {
                count++;
            }
        }
        if (!new_question) {
            for (let i=0; i < used_questions.length; i++) {
                question = used_questions[i];
                question_id = question.getQuestionID();
                let q = await DO.getAskedQuestion(question_id, channelID);
                if (q.length < 1) {
                    new_question = true;
                    break;
                }   
            }
            if (!new_question) {
                result = GameInteractionErr.NoNewQuestionAvailable;
            }
        }
    }

    let channel: Channel | undefined = await client.channels.cache.get(channelID);
    if (typeof channel === 'undefined') result = GameInteractionErr.GuildDataUnavailable;
    channel = channel as TextChannel;

    // in 23 hours, display the response
    let duration = BCONST.TIME_UNTIL_ANSWER;
    if (prev_question_time_remaining > 0) {
        duration = prev_question_time_remaining;
    }

    if (!result) {
        const d = new Date();
        let time = d.getTime();
        let day = d.getDate();
        let month = d.getMonth() + 1;
        let year = d.getFullYear();
        let q_ch = await DO.getQuestionChannel(channelID);
        if (q_ch.length < 1) {
            result = GameInteractionErr.QuestionChannelDoesNotExist;
        }
        // check if the question already exists
        let aq_sql: AskedQuestionO[];
        aq_sql  = await DO.getAskedQuestion(question_id!!, channelID);
        let max_img_index = Math.floor(Math.random()*BCONST.MAXIMUS_IMAGES.length);
        let answers_scrambled: ShuffledAnswerItem[];
        if (aq_sql.length <= 0) {
            // check if the answers are " A ", " B ", " C ", " D " ; don't scramble if they are.
            if (question!!.getAnswers()[0].toLowerCase().includes(" a ") &&
            question!!.getAnswers()[1].toLowerCase().includes(" b ") &&
            question!!.getAnswers()[2].toLowerCase().includes(" c ") &&
            question!!.getAnswers()[3].toLowerCase().includes(" d ")) {
                console.log(`not scrambling the answers b/c " A ", " B ", " C ", " D "`);
                answers_scrambled = question!!.getAnswersScrambled(false);
            }
            else {
                console.log("scrambling the answers");
                answers_scrambled = question!!.getAnswersScrambled();
            }
            
            // create the new question
            let aq = {"ask_id": 0,
                "channel_id": channelID,
                "question_id": question_id!!,
                "date": time,
                "response_total": 0,
                "response_correct": 0,
                "active": 1,
                "ans_a": answers_scrambled[0]["i"],
                "ans_b": answers_scrambled[1]["i"],
                "ans_c": answers_scrambled[2]["i"],
                "ans_d": answers_scrambled[3]["i"],
                "max_img": max_img_index,
                "message_id": "",
                "next_question_time": -1,
                "show_result_time": time + duration} as AskedQuestionI; 
            result = await DO.insertAskedQuestion(aq);
            question!!.setShownTotal(question!!.getShownTotal() + 1);
            result = await DO.updateQuestion(question!!, result);   
            aq_sql = await DO.getAskedQuestion(question_id!!, channelID);
        }
        else {
            console.log("usingn aq sql scrambled answers")
            answers_scrambled = aq_sql[0].getAnswersScrambled(question!!);
        }
        console.log(answers_scrambled);
        if (aq_sql.length < 1) {
            result = GameInteractionErr.SQLConnectionError;
        }
        if (!result) {
            let ask_id = aq_sql[0].getAskID();
            console.log(`ask_id: ${ask_id}`);
            // display the new question
            let thumbnail = BCONST.MAXIMUS_IMAGES[max_img_index].url;
            const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
            embed.setTitle(`**Question ${(result<1) ? q_ch[0].getQuestionsAsked()+1 : "???"}**`);
            let description = "_" + BCONST.MAXIMUS_PHRASES_START[Math.floor(Math.random()*BCONST.MAXIMUS_PHRASES_START.length)] + "_\n\n";
            description += "**" + question!!.getQuestion() + '**\n';

            if (question!!.getImage().length > 3) {
                embed.setImage(question!!.getImage());
            }
            
            let itemsDropDown_interval = Array<DropdownItem>();
            let letter: string;
            for (let i=0; i < 4; i++) {
                if (i == 0) letter = "A"
                else if (i == 1) letter = "B"
                else if (i == 2) letter = "C"
                else letter = "D"
                description += `\n${letter}. ${answers_scrambled[i].ans}`;
                itemsDropDown_interval.push({"description": `${letter}. ${answers_scrambled[i].ans}`, "label": letter, "value": String(answers_scrambled[i].i)});
            }
            if (duration/1000/60/60 > 1) {
                description += `\n\nUsers have ${Math.ceil(duration/1000/60/60)} hours to answer the question.`;
            }
            else if (duration/1000/60/60 < 1) {
                description += `\n\nUsers have less than an hour to answer the question.`;
            }
            else {
                description += `\n\nUsers have an hour to answer the question.`;
            }
            
            embed.setDescription(description);
            const dropdown_answer: any = new ActionRowBuilder()
                .addComponents( new StringSelectMenuBuilder()
                    .setCustomId(BCONST.DROPDOWN_ANSWER)
                    .setPlaceholder('Select a response.')
                    .addOptions(itemsDropDown_interval));
            const btn_go: any = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(BCONST.BTN_SUBMIT).setLabel("Submit").setStyle(ButtonStyle.Primary));

            let message = await channel!!.send({ embeds:[embed], components: [dropdown_answer, btn_go]});
            // update the question's message_id
            aq_sql[0].setMessageID(message.id);
            result = await DO.updateAskedQuestion(aq_sql[0], result);

            const filter_btn = (inter: MessageComponentInteraction) => inter.customId === BCONST.BTN_SUBMIT;
            const filter_dropdown = (inter: MessageComponentInteraction) => inter.customId === BCONST.DROPDOWN_ANSWER;
            // Create a message component interaction collector
            const collector_btn = message.createMessageComponentCollector({ filter: filter_btn});
            const collector_drop = message.createMessageComponentCollector({filter: filter_dropdown});
            collector_btn.on('collect', async (inter: ButtonInteraction) => {
                await inter.deferReply({ephemeral: true});
                pressGoButton(inter, message, question_id, ask_id, embed, description).then(async ([err, selected]) => {
                    let resp = "";
                    switch (err) {
                        case 0: 
                            resp = `You have selected \`${question.getAnswers()[selected]}\` as your response.`;
                            break;
                        case GameInteractionErr.NoAnswerSelected:
                            resp = "Please select an answer to submit.";
                            break;
                        case GameInteractionErr.QuestionExpired:
                            resp = "This question is no longer active.";
                            break;
                        case GameInteractionErr.QuestionDoesNotExist:
                            resp = "This question is not available.";
                            break;
                        case GameInteractionErr.GameDoesNotExist:
                            resp = "This trivia game has been terminated.";
                        case GameInteractionErr.GuildDataUnavailable:
                        case GameInteractionErr.SQLConnectionError:
                        default:
                            resp = "Something went wrong.";
                    }

                    // respond to the interaction
                    inter.editReply(resp);
                });
            });
            collector_btn.on('end', (collected: string) => {
                // nothing 
            });
            collector_drop.on('collect', async (inter: StringSelectMenuInteraction) => {
                console.log("etnered string select menu")
                //if (inter.type < 6) {
                    await inter.deferUpdate();
                //}
                console.log("menu selected: ", inter.values)
                let result = 0;
                let user_answer = await DO.getPlayerAnswer(inter.user.id, ask_id);
                if (user_answer.length > 0) {
                    console.log("user_answer length > 0")
                    user_answer[0].setResponse(Number(inter.values[0]));
                    result = await DO.updatePlayerAnswer(user_answer[0], result)
                    console.log("player answer updated");
                }
                else {
                    let user_answer_interface = {"answer_id": 0, "user": inter.user.id, "ask_id": ask_id, "response": Number(inter.values[0]), "submitted": 0} as PlayerAnswerI
                    result = await DO.insertPlayerAnswer(user_answer_interface);
                }
            });
            collector_drop.on('end', (collected: string) => {
                // nothing
            });

            setTimeout(showQuestionResult, duration, message, ask_id);
        }
    }

    return result;
}

async function pressGoButton(interaction: Interaction, message: Message, questionID: number, ask_id: number, base_embed: EmbedBuilder, base_description: string): Promise<[number, number]> {
    let result = 0;
    let player_answer_number = -1;
    let player_answer: PlayerAnswerO[];

    if (interaction.channelId != null && await gameStillActive(interaction.channelId)) {

        let currentQuestions = await DO.getAskedQuestion(questionID, interaction.channelId);
        let currentQuestion: AskedQuestionO | null = null;
        // check that the question is still active
        if (currentQuestions.length > 0) {
            for (let i=0; i < currentQuestions.length; i++) {
                if (currentQuestions[i].getActive()) {
                    currentQuestion = currentQuestions[i];
                    console.log("[BTN] current question = ", i)
                }
            }
        }
        else {
            console.log("[BTN] current question does not exist")
            result = GameInteractionErr.QuestionDoesNotExist;
        }
    
        // check that the user has selected an option
        if (currentQuestion != null) {
            console.log("[BTN] currentQuestion != null")
            player_answer = await DO.getPlayerAnswer(interaction.user.id, ask_id);
            if (player_answer.length > 0) {
                if (player_answer[0].getResponse() < 0 || player_answer[0].getResponse() > 3) {
                    result = GameInteractionErr.NoAnswerSelected;
                }
                else {
                    player_answer_number = player_answer[0].getResponse();
                }
            }
            else {
                console.log("[BTN] no player answer")
                result = GameInteractionErr.NoAnswerSelected;
            }
        }
        else {
            console.log("[BTN] currenquestion = null")
            result = GameInteractionErr.QuestionExpired;
        }
    }
    else if (interaction.channelId == null) {
        console.log("[BTN] no internetaction channel");
        result = GameInteractionErr.GuildDataUnavailable;
    }
    else {
        result = GameInteractionErr.GameDoesNotExist;
    }

    // update the user data
    if (!result) {
        player_answer!![0].setSubmitted(1);
        result = await DO.updatePlayerAnswer(player_answer!![0], result);
    }

    // update the message for total number of responses:
    if (!result) {
        let responses = await DO.getPlayerAnswers(ask_id);
        if (responses.length > 0) {
            base_description += `\n\nCurrent Responses: \`${responses.length}\``;
            base_embed.setDescription(base_description);
            message.edit({embeds: [base_embed]});
        }
    }
    
    return [result, player_answer_number];
}