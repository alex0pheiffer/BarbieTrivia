import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, Channel, ChatInputCommandInteraction, Client, EmbedBuilder, Interaction, Message, MessageComponentInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, TextChannel } from "discord.js";
import { DO } from "./data/DOBuilder"
import { QuestionChannelI } from "./data/data_interfaces/questionChannel";
import { GameInteractionErr } from "./Errors";
import { BCONST } from "./BCONST";
import { DropdownItem } from "./data/component_interfaces/dropdown_item";
import { QuestionO } from "./data/data_objects/question";
import { AskedQuestionO } from "./data/data_objects/askedQuesetion";
import { PlayerAnswerI } from "./data/data_interfaces/playerAnswer";
import { AskedQuestionI } from "./data/data_interfaces/askedQuestion";


export async function createNewGame(interaction: ChatInputCommandInteraction): Promise<Number> {
    let result: number;
    let channelId: string;
    let channel = interaction.options.getChannel(`chosenChannel`);
    if (!channel) {
        channelId = interaction.channelId; 
    }
    else {
        channelId = channel.id;
    }

    // is there an existing game for this channel?
    console.log("Identified Channel: ", channelId);

    let existingGame = await DO.getQuestionChannel(channelId);
    console.log(`existing : ${existingGame}`);

    // create new game
    if ((existingGame).length < 1) {
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
        }

        // // prompt for frequency
        // if (result < 1) {
        //     let itemsDropDown_interval = Array<DropdownItem>();
        //     let description: string;
        //     for (let i=0; i < BCONST.QUESTION_INTERVALS.length; i++) {
        //         itemsDropDown_interval.push(BCONST.QUESTION_INTERVALS[i]);
        //     }
        //     const dropdown_interval: any = new ActionRowBuilder().addComponents( new StringSelectMenuBuilder().setCustomId(BCONST.DROPDOWN_INTERVAL).setPlaceholder('Select an interval for questions to appear.').addOptions(itemsDropDown_interval) );
        //     const btn_go: any = new ActionRowBuilder().addComponents(
        //         new ButtonBuilder().setCustomId(BCONST.BTN_SUBMIT).setLabel("Submit")); //.setStyle(ButtonStyle.Primary));
        //     let thumbnail = BCONST.MAXIMUS_IMAGES[Math.floor(Math.random()*BCONST.MAXIMUS_IMAGES.length)].url;
        //     const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
        //     embed.setTitle('**New Trivia Game**');

        //     description = `...description here...`;
        //     embed.setDescription(description);
            
        //     if (interaction.isChatInputCommand() || interaction.isButton()) {
        //         interaction.editReply({ embeds:[embed], components: [dropdown_interval, btn_go]});
        //         /*
        //         let message = await interaction.fetchReply();
        //         const filter_btn = (inter: MessageComponentInteraction) => inter.customId === TRAINC.TURN_GO_BUTTON;
        //         const filter_dropdown = (inter: MessageComponentInteraction) => inter.customId === TRAINC.TURN_PLAYEROPTION_MENU || inter.customId === TRAINC.TURN_TILEOPTION_MENU;
        //         // Create a message component interaction collector
        //         const collector_btn = message.createMessageComponentCollector({ filter: filter_btn, time: TRAINC.TURN_MENU_DURATION });
        //         const collector_drop = message.createMessageComponentCollector({filter: filter_dropdown, time: TRAINC.TURN_MENU_DURATION });
        //         collector_btn.on('collect', async (inter: ButtonInteraction) => {
        //             await inter.deferReply({ephemeral: true});
        //             pressGoButton(inter, game!!, options).then(async ([err, resp]) => {
        //                 switch (err) {
        //                     case 0: break;
        //                     case GoInteractionErr.NotPlayersTurn:
        //                         resp = "Sorry, it's not your turn.";
        //                         break;
        //                     case GoInteractionErr.PlayerNotInGame:
        //                         resp = `Sorry, you're not a part of the game. Please ask the game master, ${await VC.getUsername(interaction, game!!.getInitiator())}, to add you.`;
        //                         break;
        //                     case GoInteractionErr.GameDoesNotExist:
        //                         resp = "There is no game to play on.";
        //                         break;
        //                     case GoInteractionErr.InvalidTrainSelection:
        //                     case GoInteractionErr.InvalidTileSelection:
        //                     case GoInteractionErr.NoTileInput:
        //                     case GoInteractionErr.NoTrainInput:
        //                         break;
        //                     case GoInteractionErr.InvalidInputToSQL:
        //                     default:
        //                         resp = "Something went wrong.";
        //                 }
        
        //                 if (err != 0) await inter.editReply(resp);
        //                 // continue onto the next turn, or prompt the user to choose their 2nd move
        //                 else {
        //                     let msg = "";
                            
        //                     let turn = await DO.getPlayerTurn(userID, gameID);
        //                     if (turn == null) return InteractionErr.PlayerNotInGame;
        
        //                     // get the game data again in case something changed
        //                     game = await DO.getGame(gameID);
        //                     if (game == null) return InteractionErr.GameDoesNotExist;
        
        //                     let canPlayDrawn = false;
        //                     let drawnTile: GameTileO | null = null;
        
        //                     // notify the user of their decision
        //                     // we need the user to draw a tile before we can send them an update on their decision
        //                     if (turn.getTrain() != TRAINC.DRAW_NAME && turn.getTile_s1() == turn.getTile_s2()) resp += "\nBecause you've played a double, you must go again. **Use \`/turn\` to play again.**";
        //                     else if (turn.getTrain() == TRAINC.DRAW_NAME) {
        //                         [result, drawnTile] = await drawTile(interaction, trains, game);
        //                         // todo you will need to update resp with the correct response because of the error
        //                         if (result) {
        //                             resp = "An error occured drawing the tile.";
        //                             await inter.editReply(resp);
        //                             return result;
        //                         }
        //                         if (drawnTile == null) resp += ".\nThere were no more tiles, so no tile was drawn. Your train is open.";
        //                         else resp += `.\nYou have drawn a ${createTileString(drawnTile!!.s1, drawnTile!!.s2)}.`;
        
        //                         // check if the tile can be played again
        //                         if (drawnTile !== null) {                        
        //                             if (drawnTileIsValid(game, drawnTile!!, trains, isDoubleIgnore)) {
        //                                 resp += `\nBecause you can play the drawn tile, you can play it now. **Use \`/turn\` to play the tile.**`;
        //                                 canPlayDrawn = true;
        //                                 turn.setPlay_drawn(1);
        //                                 result = await DO.updatePlayerTurn(turn);
        //                                 if (result) return result;
        //                             }
        //                             else resp += `\nYour train is open.`;
        //                         }
        //                     }
        //                     await inter.editReply(resp);
        
        //                     // user is playing a double
        //                     if (turn.getTrain() != TRAINC.DRAW_NAME && turn.getTile_s1() == turn.getTile_s2()) {
                        
        //                         [result, msg] = await playTile(interaction, turn, game, trains);
        //                         if (result) return result;
        
        //                         // check if player has won
        //                         let gameOverResult = await gameOver(game.getPlayers(), game.getGameID());
        //                         if (gameOverResult != null) {
        //                             await interaction.deleteReply();
        //                             result = await endRound(inter, gameOverResult, WinType.Default, game, trains, msg);
        //                             return result;
        //                         }
        
        //                         msg += `\nBecause it is a double, they will play again.\n`;
        //                         result = await showBoardForContinueTurn(interaction, msg);
        //                         // currently not passing the previous play as a msg
        //                         result = await takeTurn(interaction, userID);
        //                         await interaction.deleteReply();
        //                         return result;
        //                     }
        //                     // user is drawing a tile
        //                     else if (canPlayDrawn) {
        //                         result = await takeTurn(interaction, userID);
        //                         await interaction.deleteReply();
        //                         return result;
        //                     }
        
        //                     if (turn.getPlay_drawn()) msg += `\n${await VC.getUsername(interaction, userID)} has drawn a tile, but was able to play it.`;
        
        //                     // next turn
        //                     result = await endTurn(inter, turn, trains, game, msg, drawnTile);
        //                     return result;
        //                 }
                        
        //             });
        //         });
        //         collector_btn.on('end', collected => {
        //             // nothing 
        //         });
        //         collector_drop.on('collect', (inter: StringSelectMenuInteraction) => {
        //             selectPlayerTurnMenu(inter, options).then(async (err: number) => {
        //                 switch(err) {
        //                     case 0: return;
        //                     case InteractionErr.PlayerNotInGame: 
        //                         interaction.reply({ 
        //                             content: `You cannot take a turn if you are not part of the game. Ask the game master, ${await VC.getUsername(interaction, game!!.getInitiator())}, to add you.`, 
        //                             ephemeral: true });
        //                         break;
        //                     default:
        //                         interaction.reply({ 
        //                             content: 'There was an error while executing this command.', 
        //                             ephemeral: true });
        //                 }
        //             })
        //         });
        //         collector_drop.on('end', collected => {
        //             // nothing
        //         });
        //         */
        //     }
        // }
    }
    else {
        result = GameInteractionErr.GameAlreadyExists;
    }
    return result;
}

export async function canInitiateNewGame(interaction: ChatInputCommandInteraction): Promise<Number> {
    let result: number;
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
        console.log(`existing : ${existingGame}`);
        if (existingGame.length > 0) {
            result = GameInteractionErr.GameAlreadyExistsInServer;
        }
        else {
            result = 0;
        }
    }
    
    console.log(`result: ${result}`);

    return result;
}

export async function createNewQuestion(serverID: string, channelID: string, client: Client): Promise<Number> {
    let result = 0;
    let question: QuestionO;
    let question_id: number;

    // are we in the lead/master server?
    if (serverID == BCONST.MASTER_QUESTION_SERVER) {

        let unused_questions = await DO.getUnusedQuestions();
        let rand = Math.floor(Math.random()*unused_questions.length);
        let question = unused_questions[rand];
        let question_id = question.getQuestionID();
        
    }
    else {
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

    // get the channel
    let channel: Channel | undefined = await client.channels.cache.get(channelID);
    if (typeof channel === 'undefined') result = GameInteractionErr.GuildDataUnavailable;
    channel = channel as TextChannel;

    if (!result) {
        // current date/time
        const d = new Date();
        let time = d.getTime();
        let day = d.getDay();
        let month = d.getMonth();
        let year = d.getFullYear();
        
        // create the new question
        let aq = {"ask_id": 0,
            "channel_id": channelID,
            "question_id": question_id!!,
            "date": time,
            "response_total": 0,
            "response_correct": 0,
            "active": 1} as AskedQuestionI;
        result = await DO.insertAskedQuestion(aq);
        question!!.setShownTotal(question!!.getShownTotal() + 1);
        result = await DO.updateQuestion(question!!, result);
        let aq_sql = await DO.getAskedQuestion(question_id!!, channelID);
        if (aq_sql.length < 1) {
            result = GameInteractionErr.SQLConnectionError;
        }
        if (!result) {
            let ask_id = aq_sql[0].getAskID();
            // display the new question
            let thumbnail = BCONST.MAXIMUS_IMAGES[Math.floor(Math.random()*BCONST.MAXIMUS_IMAGES.length)].url;
            const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
            embed.setTitle(`**Question (${month}/${day}/${year})**`);
            let description = question!!.getQuestion();
            embed.setDescription(description);
            
            let itemsDropDown_interval = Array<DropdownItem>();
            let answers_scrambled = question!!.getAnswersScrambled();
            let letter: string;
            for (let i=0; i < 4; i++) {
                if (i == 0) letter = "A"
                else if (i == 1) letter = "B"
                else if (i == 2) letter = "C"
                else letter = "D"
                let value = 0;
                for (let j=0; j<4; j++) {
                    if (question!!.getAnswers()[j] == answers_scrambled[i])
                        value = j;
                }
                itemsDropDown_interval.push({"label": `${letter}. ${answers_scrambled[i]}`, "description": letter, "value": value});
            }
            const dropdown_interval: any = new ActionRowBuilder().addComponents( new StringSelectMenuBuilder().setCustomId(BCONST.DROPDOWN_INTERVAL).setPlaceholder('Select an interval for questions to appear.').addOptions(itemsDropDown_interval) );
            const btn_go: any = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(BCONST.BTN_SUBMIT).setLabel("Submit")); //.setStyle(ButtonStyle.Primary));

            let message = await channel!!.send({ embeds:[embed]});

            const filter_btn = (inter: MessageComponentInteraction) => inter.customId === BCONST.BTN_SUBMIT;
            const filter_dropdown = (inter: MessageComponentInteraction) => inter.customId === BCONST.DROPDOWN_ANSWER;
            // Create a message component interaction collector
            const collector_btn = message.createMessageComponentCollector({ filter: filter_btn, time: BCONST.DROPDOWN_DURATION });
            const collector_drop = message.createMessageComponentCollector({filter: filter_dropdown, time: BCONST.DROPDOWN_DURATION });
            collector_btn.on('collect', async (inter: ButtonInteraction) => {
                await inter.deferReply({ephemeral: true});
                pressGoButton(inter, question_id, channelID).then(async (err) => {
                    switch (err) {
                        case 0: break;
                        case GameInteractionErr.NoAnswerSelected:
                            resp = "Please select an answer to submit.";
                            break;
                        default:
                            resp = "Something went wrong.";
                    }
                });
            });
            collector_btn.on('end', (collected: string) => {
                // nothing 
            });
            collector_drop.on('collect', async (inter: StringSelectMenuInteraction) => {
                let result = 0;
                let user_answer = await DO.getPlayerAnswer(inter.user.id, ask_id);
                if (user_answer.length > 0) {
                    user_answer[0].setResponse(Number(inter.values[0]));
                    result = await DO.updatePlayerAnswer(user_answer[0], result)
                }
                else {
                    let user_answer_interface = {"answer_id": 0, "user": inter.user.id, "ask_id": ask_id, "response": Number(inter.values[0])} as PlayerAnswerI
                    result = await DO.insertPlayerAnswer(user_answer_interface);
                }
            });
            collector_drop.on('end', (collected: string) => {
                // nothing
            });
        }
    }

    return result;
}

async function pressGoButton(interaction: Interaction, questionID: number, ask_id: number): Promise<number> {
    let result = 0;
    if (interaction.channelId == null) {
        result = GameInteractionErr.GuildDataUnavailable;
    }
    else {
        let currentQuestions = await DO.getAskedQuestion(questionID, interaction.channelId);
        let currentQuestion: AskedQuestionO | null = null;
        // check that the question is still active
        if (currentQuestions.length > 0) {
            for (let i=0; i < currentQuestions.length; i++) {
                if (currentQuestions[i].getActive()) {
                    currentQuestion = currentQuestions[i];
                }
            }
        }
        else {
            result = GameInteractionErr.QuestionDoesNotExist;
        }
    
        // check that the user has selected an option
        if (currentQuestion != null) {
            let player_answer = await DO.getPlayerAnswer(interaction.user.id, ask_id);
            if (player_answer.length > 0) {
                if (player_answer[0].getResponse() < 0 || player_answer[0].getResponse() > 3) {
                    result = GameInteractionErr.NoAnswerSelected;
                }
            }
            else {
                result = GameInteractionErr.NoAnswerSelected;
            }
        }
        else {
            result = GameInteractionErr.QuestionExpired;
        }
    }

    // update the user data
    if (!result) {

    }
    
    return result;
}