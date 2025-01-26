"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewQuestion = exports.canInitiateNewGame = exports.createNewGame = void 0;
const discord_js_1 = require("discord.js");
const DOBuilder_1 = require("./data/DOBuilder");
const Errors_1 = require("./Errors");
const BCONST_1 = require("./BCONST");
const question_cycle_1 = require("./question_cycle");
const end_1 = require("./end");
async function createNewGame(interaction) {
    let result = 0;
    let channelId;
    let channel = interaction.options.getChannel(`chosenChannel`);
    if (!channel) {
        channelId = interaction.channelId;
    }
    else {
        channelId = channel.id;
    }
    let serverId = interaction.guildId;
    if (serverId == null)
        result = Errors_1.GameInteractionErr.GuildDataUnavailable;
    // is there an existing game for this channel?
    let existingGame = await DOBuilder_1.DO.getQuestionChannel(channelId);
    let updateGame = null;
    if (existingGame.length > 0) {
        for (let i = 0; i < existingGame.length; i++) {
            let qch = existingGame[i];
            if (qch.getOwner().length < 1) {
                qch.setOwner(interaction.user.id);
                qch.setChannel(channelId);
                result = await DOBuilder_1.DO.updateQuestionChannel(qch, result);
                let games = await DOBuilder_1.DO.getQuestionChannel(qch.getChannel());
                for (let j = 0; j < games.length; j++) {
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
        let newQuestionChannel = {
            qch_id: 0,
            server: interaction.guildId,
            channel: channelId,
            owner: interaction.user.id,
            date: time,
            question: 0
        };
        result = await DOBuilder_1.DO.insertQuestionChannel(newQuestionChannel);
        if (result) {
            result = Errors_1.GameInteractionErr.SQLConnectionError;
        }
        else {
            let thumbnail = BCONST_1.BCONST.MAXIMUS_IMAGES[Math.floor(Math.random() * BCONST_1.BCONST.MAXIMUS_IMAGES.length)].url;
            const embed = new discord_js_1.EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
            embed.setTitle('**New Trivia Game**');
            let description = `This is the beginning of a new trivia game! This game is specific to this channel in this server.\
            Every 24-48 hours, a new question will be asked. All participants in the channel have the next 23 hours to provide their answer to the question.\
            \nYou can also add new trivia to the pool! Try it yourself with the \`/add\` command.`;
            embed.setDescription(description);
            interaction.editReply({ embeds: [embed] });
            // create the new question
            createNewQuestion(serverId, channelId, interaction.client);
        }
    }
    else if (updateGame != null) {
        let thumbnail = BCONST_1.BCONST.MAXIMUS_IMAGES[Math.floor(Math.random() * BCONST_1.BCONST.MAXIMUS_IMAGES.length)].url;
        const embed = new discord_js_1.EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
        embed.setTitle('**Continued Trivia Game**');
        let description = `This is the continuation of a previously closed trivia game! This game is specific to this channel in this server.\
        Every 24-48 hours, a new question will be asked. All participants in the channel have the next 23 hours to provide their answer to the question.\
        \nYou can also add new trivia to the pool! Try it yourself with the \`/add\` command.`;
        embed.setDescription(description);
        interaction.editReply({ embeds: [embed] });
        // create the new question
        createNewQuestion(serverId, channelId, interaction.client);
    }
    else {
        result = Errors_1.GameInteractionErr.GameAlreadyExists;
    }
    return result;
}
exports.createNewGame = createNewGame;
async function canInitiateNewGame(interaction) {
    let result = 0;
    let channelId;
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
        result = Errors_1.GameInteractionErr.GuildDataUnavailable;
    }
    else {
        let existingGame = await DOBuilder_1.DO.getQuestionChannelByServer(serverId);
        if (existingGame.length <= 0) {
            return 0;
        }
        else {
            for (let i = 0; i < existingGame.length; i++) {
                let qch = existingGame[i];
                // if a channel exists, see if it has an owner
                if (qch.getOwner().length > 0) {
                    result = Errors_1.GameInteractionErr.GameAlreadyExistsInServer;
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
exports.canInitiateNewGame = canInitiateNewGame;
async function createNewQuestion(serverID, channelID, client, selected_question = -1, prev_question_time_remaining = -1) {
    let result = 0;
    let question;
    let question_id;
    // check if the game is still active
    console.log("checking if game is active");
    if (!(await (0, end_1.gameStillActive)(channelID))) {
        result = Errors_1.GameInteractionErr.GameDoesNotExist;
    }
    console.log("game is active?: ", result);
    // are we in the lead/master server?
    if (selected_question >= 0) {
        console.log("selected > 0");
        let question_attempt = await DOBuilder_1.DO.getQuestion(selected_question);
        if (question_attempt) {
            question = question_attempt;
            question_id = question.getQuestionID();
        }
        else {
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
            console.log("question does not exist");
        }
    }
    else if (serverID == BCONST_1.BCONST.MASTER_QUESTION_SERVER) {
        console.log("master server");
        let unused_questions = await DOBuilder_1.DO.getUnusedQuestions();
        let rand = Math.floor(Math.random() * unused_questions.length);
        question = unused_questions[rand];
        console.log(`Selected question: [${question.getQuestionID()}][${question.getQuestion()}]`);
        question_id = question.getQuestionID();
    }
    else {
        console.log("other server (not master)");
        // TODO this is untested
        // choose a random question that has already been asked in the master server,
        // but hasn't been asked in this server.
        let used_questions = await DOBuilder_1.DO.getUsedQuestions();
        // choose a random question that hasn't been asked in this server yet.
        let count_max = 20;
        let count = 0;
        let new_question = false;
        while (!new_question && count < count_max) {
            let i = Math.floor(Math.random() * used_questions.length);
            question = used_questions[i];
            question_id = question.getQuestionID();
            let q = await DOBuilder_1.DO.getAskedQuestion(question_id, channelID);
            if (q.length < 1) {
                new_question = true;
            }
            else {
                count++;
            }
        }
        if (!new_question) {
            for (let i = 0; i < used_questions.length; i++) {
                question = used_questions[i];
                question_id = question.getQuestionID();
                let q = await DOBuilder_1.DO.getAskedQuestion(question_id, channelID);
                if (q.length < 1) {
                    new_question = true;
                    break;
                }
            }
            if (!new_question) {
                result = Errors_1.GameInteractionErr.NoNewQuestionAvailable;
            }
        }
    }
    let channel = await client.channels.cache.get(channelID);
    if (typeof channel === 'undefined')
        result = Errors_1.GameInteractionErr.GuildDataUnavailable;
    channel = channel;
    // in 23 hours, display the response
    let duration = BCONST_1.BCONST.TIME_UNTIL_ANSWER;
    if (prev_question_time_remaining > 0) {
        duration = prev_question_time_remaining;
    }
    console.log("result beforoe date: ", result);
    if (!result) {
        const d = new Date();
        let time = d.getTime();
        let day = d.getDate();
        let month = d.getMonth() + 1;
        let year = d.getFullYear();
        let q_ch = await DOBuilder_1.DO.getQuestionChannel(channelID);
        if (q_ch.length < 1) {
            result = Errors_1.GameInteractionErr.QuestionChannelDoesNotExist;
        }
        // check if the question already exists
        let aq_sql;
        aq_sql = await DOBuilder_1.DO.getAskedQuestion(question_id, channelID);
        let max_img_index = Math.floor(Math.random() * BCONST_1.BCONST.MAXIMUS_IMAGES.length);
        let answers_scrambled;
        if (aq_sql.length <= 0) {
            // check if the answers are " A ", " B ", " C ", " D " ; don't scramble if they are.
            if (question.getAnswers()[0].toLowerCase().includes(" a ") &&
                question.getAnswers()[1].toLowerCase().includes(" b ") &&
                question.getAnswers()[2].toLowerCase().includes(" c ") &&
                question.getAnswers()[3].toLowerCase().includes(" d ")) {
                console.log(`not scrambling the answers b/c " A ", " B ", " C ", " D "`);
                answers_scrambled = question.getAnswersScrambled(false);
            }
            else {
                console.log("scrambling the answers");
                answers_scrambled = question.getAnswersScrambled();
            }
            // create the new question
            let aq = { "ask_id": 0,
                "channel_id": channelID,
                "question_id": question_id,
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
                "show_result_time": time + duration };
            result = await DOBuilder_1.DO.insertAskedQuestion(aq);
            question.setShownTotal(question.getShownTotal() + 1);
            result = await DOBuilder_1.DO.updateQuestion(question, result);
            aq_sql = await DOBuilder_1.DO.getAskedQuestion(question_id, channelID);
        }
        else {
            console.log("usingn aq sql scrambled answers");
            answers_scrambled = aq_sql[0].getAnswersScrambled(question);
        }
        console.log(answers_scrambled);
        if (aq_sql.length < 1) {
            result = Errors_1.GameInteractionErr.SQLConnectionError;
        }
        if (!result) {
            let ask_id = aq_sql[0].getAskID();
            console.log(`ask_id: ${ask_id}`);
            // display the new question
            let thumbnail = BCONST_1.BCONST.MAXIMUS_IMAGES[max_img_index].url;
            const embed = new discord_js_1.EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
            embed.setTitle(`**Question ${(result < 1) ? q_ch[0].getQuestionsAsked() + 1 : "???"}**`);
            let description = "_" + BCONST_1.BCONST.MAXIMUS_PHRASES_START[Math.floor(Math.random() * BCONST_1.BCONST.MAXIMUS_PHRASES_START.length)] + "_\n";
            if (question.getResponseTotal() > 0) {
                description += `${Math.floor(question.getResponseCorrect() / question.getResponseTotal())}% people got this right.`;
            }
            description += "\n\n";
            description += "**" + question.getQuestion() + '**\n';
            if (question.getImage().length > 3) {
                embed.setImage(question.getImage());
            }
            let itemsDropDown_interval = Array();
            let letter;
            for (let i = 0; i < 4; i++) {
                if (i == 0)
                    letter = "A";
                else if (i == 1)
                    letter = "B";
                else if (i == 2)
                    letter = "C";
                else
                    letter = "D";
                description += `\n${letter}. ${answers_scrambled[i].ans}`;
                itemsDropDown_interval.push({ "description": `${letter}. ${answers_scrambled[i].ans}`, "label": letter, "value": String(answers_scrambled[i].i) });
            }
            if (duration / 1000 / 60 / 60 > 1) {
                description += `\n\nUsers have ${Math.ceil(duration / 1000 / 60 / 60)} hours to answer the question.`;
            }
            else if (duration / 1000 / 60 / 60 < 1) {
                description += `\n\nUsers have less than an hour to answer the question.`;
            }
            else {
                description += `\n\nUsers have an hour to answer the question.`;
            }
            embed.setDescription(description);
            const dropdown_answer = new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.StringSelectMenuBuilder()
                .setCustomId(BCONST_1.BCONST.DROPDOWN_ANSWER)
                .setPlaceholder('Select a response.')
                .addOptions(itemsDropDown_interval));
            const btn_go = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId(BCONST_1.BCONST.BTN_SUBMIT).setLabel("Submit").setStyle(discord_js_1.ButtonStyle.Primary));
            let message = await channel.send({ embeds: [embed], components: [dropdown_answer, btn_go] });
            // update the question's message_id
            aq_sql[0].setMessageID(message.id);
            result = await DOBuilder_1.DO.updateAskedQuestion(aq_sql[0], result);
            const filter_btn = (inter) => inter.customId === BCONST_1.BCONST.BTN_SUBMIT;
            const filter_dropdown = (inter) => inter.customId === BCONST_1.BCONST.DROPDOWN_ANSWER;
            // Create a message component interaction collector
            const collector_btn = message.createMessageComponentCollector({ filter: filter_btn });
            const collector_drop = message.createMessageComponentCollector({ filter: filter_dropdown });
            collector_btn.on('collect', async (inter) => {
                await inter.deferReply({ ephemeral: true });
                pressGoButton(inter, message, question_id, ask_id, embed, description).then(async ([err, selected]) => {
                    let resp = "";
                    switch (err) {
                        case 0:
                            resp = `You have selected \`${question.getAnswers()[selected]}\` as your response.`;
                            break;
                        case Errors_1.GameInteractionErr.NoAnswerSelected:
                            resp = "Please select an answer to submit.";
                            break;
                        case Errors_1.GameInteractionErr.QuestionExpired:
                            resp = "This question is no longer active.";
                            break;
                        case Errors_1.GameInteractionErr.QuestionDoesNotExist:
                            resp = "This question is not available.";
                            break;
                        case Errors_1.GameInteractionErr.GameDoesNotExist:
                            resp = "This trivia game has been terminated.";
                        case Errors_1.GameInteractionErr.GuildDataUnavailable:
                        case Errors_1.GameInteractionErr.SQLConnectionError:
                        default:
                            resp = "Something went wrong.";
                    }
                    // respond to the interaction
                    inter.editReply(resp);
                });
            });
            collector_btn.on('end', (collected) => {
                // nothing 
            });
            collector_drop.on('collect', async (inter) => {
                console.log("etnered string select menu");
                //if (inter.type < 6) {
                await inter.deferUpdate();
                //}
                console.log("menu selected: ", inter.values);
                let result = 0;
                let user_answer = await DOBuilder_1.DO.getPlayerAnswer(inter.user.id, ask_id);
                if (user_answer.length > 0) {
                    console.log("user_answer length > 0");
                    user_answer[0].setResponse(Number(inter.values[0]));
                    result = await DOBuilder_1.DO.updatePlayerAnswer(user_answer[0], result);
                    console.log("player answer updated");
                }
                else {
                    let user_answer_interface = { "answer_id": 0, "user": inter.user.id, "ask_id": ask_id, "response": Number(inter.values[0]), "submitted": 0 };
                    result = await DOBuilder_1.DO.insertPlayerAnswer(user_answer_interface);
                }
            });
            collector_drop.on('end', (collected) => {
                // nothing
            });
            setTimeout(question_cycle_1.showQuestionResult, duration, message, ask_id);
        }
    }
    return result;
}
exports.createNewQuestion = createNewQuestion;
async function pressGoButton(interaction, message, questionID, ask_id, base_embed, base_description) {
    let result = 0;
    let player_answer_number = -1;
    let player_answer;
    if (interaction.channelId != null && await (0, end_1.gameStillActive)(interaction.channelId)) {
        let currentQuestions = await DOBuilder_1.DO.getAskedQuestion(questionID, interaction.channelId);
        let currentQuestion = null;
        // check that the question is still active
        if (currentQuestions.length > 0) {
            for (let i = 0; i < currentQuestions.length; i++) {
                if (currentQuestions[i].getActive()) {
                    currentQuestion = currentQuestions[i];
                    console.log("[BTN] current question = ", i);
                }
            }
        }
        else {
            console.log("[BTN] current question does not exist");
            result = Errors_1.GameInteractionErr.QuestionDoesNotExist;
        }
        // check that the user has selected an option
        if (currentQuestion != null) {
            console.log("[BTN] currentQuestion != null");
            player_answer = await DOBuilder_1.DO.getPlayerAnswer(interaction.user.id, ask_id);
            if (player_answer.length > 0) {
                if (player_answer[0].getResponse() < 0 || player_answer[0].getResponse() > 3) {
                    result = Errors_1.GameInteractionErr.NoAnswerSelected;
                }
                else {
                    player_answer_number = player_answer[0].getResponse();
                }
            }
            else {
                console.log("[BTN] no player answer");
                result = Errors_1.GameInteractionErr.NoAnswerSelected;
            }
        }
        else {
            console.log("[BTN] currenquestion = null");
            result = Errors_1.GameInteractionErr.QuestionExpired;
        }
    }
    else if (interaction.channelId == null) {
        console.log("[BTN] no internetaction channel");
        result = Errors_1.GameInteractionErr.GuildDataUnavailable;
    }
    else {
        result = Errors_1.GameInteractionErr.GameDoesNotExist;
    }
    // update the user data
    if (!result) {
        player_answer[0].setSubmitted(1);
        result = await DOBuilder_1.DO.updatePlayerAnswer(player_answer[0], result);
    }
    // update the message for total number of responses:
    if (!result) {
        let responses = await DOBuilder_1.DO.getPlayerAnswers(ask_id);
        if (responses.length > 0) {
            base_description += `\n\nCurrent Responses: \`${responses.length}\``;
            base_embed.setDescription(base_description);
            message.edit({ embeds: [base_embed] });
        }
    }
    return [result, player_answer_number];
}
