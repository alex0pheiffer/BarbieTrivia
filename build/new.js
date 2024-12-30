"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canInitiateNewGame = exports.createNewGame = void 0;
const DOBuilder_1 = require("./data/DOBuilder");
const Errors_1 = require("./Errors");
async function createNewGame(interaction) {
    let result;
    let channelId;
    let channel = interaction.options.getChannel(`chosenChannel`);
    if (!channel) {
        channelId = interaction.channelId;
    }
    else {
        channelId = channel.id;
    }
    // is there an existing game for this channel?
    let existingGame = await DOBuilder_1.DO.getQuestionChannel(channelId);
    console.log(`existing : ${existingGame}`);
    // create new game
    if ((existingGame).length < 1) {
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
        console.log(result);
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
        result = Errors_1.GameInteractionErr.GameAlreadyExists;
    }
    return result;
}
exports.createNewGame = createNewGame;
async function canInitiateNewGame(interaction) {
    return 0;
}
exports.canInitiateNewGame = canInitiateNewGame;
