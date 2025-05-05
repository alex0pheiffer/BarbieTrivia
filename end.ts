import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Channel, ChatInputCommandInteraction, Client, EmbedBuilder, Interaction, Message, MessageComponentInteraction, StringSelectMenuBuilder, StringSelectMenuInteraction, TextChannel } from "discord.js";
import { DO } from "./data/DOBuilder"
import { GameInteractionErr } from "./Errors";
import { QuestionChannelO } from "./data/data_objects/questionChannel";

export async function getGameInQuestionToEnd(interaction: ChatInputCommandInteraction): Promise<[QuestionChannelO | null, number]> {
    let game: QuestionChannelO | null = null;
    let result = 0;
    let serverId = interaction.guildId;
    let existingGame: QuestionChannelO[] = []
    if (serverId == null) result = GameInteractionErr.GuildDataUnavailable;
    if (!result) {
        existingGame = await DO.getQuestionChannelByServer(serverId!!);
        console.log(`existing : ${existingGame}`);
    }
    // end game
    if (!result && (existingGame).length > 0) {
        // do not delete the question_channel
        // insteady, deactivate it
        // a channel is de-active if it has no owner
        for (let i=0; i < existingGame.length; i++) {
            let ch = existingGame[i];
            if (ch.getOwner().length < 1)
                continue
            else {
                game = ch;
            }
        }
    }
    else {
        result = GameInteractionErr.GameDoesNotExist;
    }
    
    return [game, result];
}

export async function hasPermissionToEnd(userID: string, game: QuestionChannelO, client: any): Promise<boolean> {
    // a user an end a game if they are:
    // - an admin
    // - the owner of the game
    // - anyone who enters /end and the owner is no longer in the server

    // check if user is an admin
    let isAdmin = await DO.getAdmin(userID);
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

// if the game has an owner
// also
// check if the bot is still in a question_channel's server
// remove the owner (deactive the game) if they are not
export async function gameStillActive(channel_id: string, client: Client): Promise<boolean> {
    console.log(channel_id);
    let game: QuestionChannelO | null = null;
    let result = 0;
    let existingGame: QuestionChannelO[] = []
    existingGame = await DO.getQuestionChannel(channel_id);
    console.log("existing game : ", existingGame);
    if (existingGame.length > 0) {
        console.log("existing game > 0")
        for (let i=0; i < existingGame.length; i++) {
            let ch = existingGame[i];
            console.log(`game [${i}] ${ch.getOwner()}`)
            if (ch.getOwner().length > 0) {
                const guild = client.guilds.cache.get(ch.getServer()!!);

                if (guild) {
                    console.log(`Still in guild: ${guild.name}`);
                } else {
                    console.log(`Bot is no longer in the guild ${ch.getServer}.`);
                    // delete the current question
                    let latest_question = await DO.getLatestAskedQuestion(ch.getChannel());
                    if (latest_question.length > 0) {
                        if (latest_question[0].getActive()) {
                            result = await DO.deleteAskedQuestion(latest_question[0].getAskID())
                        }
                    }
                    // set the owner to ""
                    ch.setOwner("");
                    result = await DO.updateQuestionChannel(ch, result);
                    return false;
                }

                return true;
            }
        }    
    }

    
    return false;
}