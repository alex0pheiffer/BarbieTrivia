"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStillActive = exports.hasPermissionToEnd = exports.getGameInQuestionToEnd = void 0;
const DOBuilder_1 = require("./data/DOBuilder");
const Errors_1 = require("./Errors");
async function getGameInQuestionToEnd(interaction) {
    let game = null;
    let result = 0;
    let serverId = interaction.guildId;
    let existingGame = [];
    if (serverId == null)
        result = Errors_1.GameInteractionErr.GuildDataUnavailable;
    if (!result) {
        existingGame = await DOBuilder_1.DO.getQuestionChannelByServer(serverId);
        console.log(`existing : ${existingGame}`);
    }
    // end game
    if (!result && (existingGame).length > 0) {
        // do not delete the question_channel
        // insteady, deactivate it
        // a channel is de-active if it has no owner
        for (let i = 0; i < existingGame.length; i++) {
            let ch = existingGame[i];
            if (ch.getOwner().length < 1)
                continue;
            else {
                game = ch;
            }
        }
    }
    else {
        result = Errors_1.GameInteractionErr.GameDoesNotExist;
    }
    return [game, result];
}
exports.getGameInQuestionToEnd = getGameInQuestionToEnd;
async function hasPermissionToEnd(userID, game, client) {
    // a user an end a game if they are:
    // - an admin
    // - the owner of the game
    // - anyone who enters /end and the owner is no longer in the server
    // check if user is an admin
    let isAdmin = await DOBuilder_1.DO.getAdmin(userID);
    if (isAdmin) {
        return true;
    }
    // check if the user is the owner
    if (userID == game.getOwner()) {
        return true;
    }
    // check if the owner is no longer in the server
    let guild = client.guilds.get(game.getServer());
    let owner_exists = await guild.member.fetch(userID);
    if (owner_exists) {
        return false;
    }
    else {
        return true;
    }
}
exports.hasPermissionToEnd = hasPermissionToEnd;
// if the game has an owner
// also
// check if the bot is still in a question_channel's server
// remove the owner (deactive the game) if they are not
async function gameStillActive(channel_id, client) {
    console.log(channel_id);
    let game = null;
    let result = 0;
    let existingGame = [];
    existingGame = await DOBuilder_1.DO.getQuestionChannel(channel_id);
    console.log("existing game : ", existingGame);
    if (existingGame.length > 0) {
        console.log("existing game > 0");
        for (let i = 0; i < existingGame.length; i++) {
            let ch = existingGame[i];
            console.log(`game [${i}] ${ch.getOwner()}`);
            if (ch.getOwner().length > 0) {
                const guild = client.guilds.cache.get(ch.getServer());
                if (guild) {
                    console.log(`Still in guild: ${guild.name}`);
                }
                else {
                    console.log(`Bot is no longer in the guild ${ch.getServer}.`);
                    // delete the current question
                    let latest_question = await DOBuilder_1.DO.getLatestAskedQuestion(ch.getChannel());
                    if (latest_question.length > 0) {
                        if (latest_question[0].getActive()) {
                            result = await DOBuilder_1.DO.deleteAskedQuestion(latest_question[0].getAskID());
                        }
                    }
                    // set the owner to ""
                    ch.setOwner("");
                    result = await DOBuilder_1.DO.updateQuestionChannel(ch, result);
                    return false;
                }
                return true;
            }
        }
    }
    return false;
}
exports.gameStillActive = gameStillActive;
