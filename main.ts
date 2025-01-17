import { ButtonInteraction, CacheType, Channel, ChatInputCommandInteraction, Client, Collection, EmbedBuilder, Events, GatewayIntentBits, Interaction, PermissionsBitField, StringSelectMenuInteraction, TextChannel } from "discord.js";
import * as fs from "fs";
const path = require('node:path');
import { BCONST }    from "./BCONST";
import { Command, SlashCommand } from "./data/types";
import { DO } from "./data/DOBuilder";
import { canInitiateNewGame, createNewGame } from "./new";
import { GameInteractionErr } from "./Errors";
import { addPrompt } from "./prompt";
import { PlayerI } from "./data/data_interfaces/player";
import { startAllQuestionChannels } from "./startup";

const client = new Client({  
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] 
});
client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));

client.on(Events.InteractionCreate, async (interaction: Interaction<CacheType>) => {
    /*
        // fail this nicer later
        if (!(interaction.isCommand() && interaction.isUserContextMenuCommand())) return -1;
        interaction = (<ChatInputCommandInteraction>interaction);
    */
        //check permissions (we have to check viewchannel for interactions..)
        if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.ViewChannel)) {
            (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **view** this channel. :frowning2:', ephemeral: true});
            return;
        }
        else if (!interaction.guild.members.me.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.SendMessages)) {
            (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **send messages** in this channel. :frowning2:', ephemeral: true});
            return;
        }
        else if (!interaction.guild.members.me.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.EmbedLinks)) {
            (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **embed links** in this channel. :frowning2:', ephemeral: true});
            return;
        }
        else if (!interaction.guild.members.me.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.UseExternalEmojis)) {
            (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **use external emojis** in this channel. :frowning2:', ephemeral: true});   
            return;
        }
        else if (!interaction.guild.members.me.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.AddReactions))  {
            (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **add reactions** in this channel. :frowning2:', ephemeral: true});
            return;
        }
        else if (!interaction.guild.members.me.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.ManageMessages))  {
            (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **manage messages** in this channel. :frowning2:', ephemeral: true});        
            return;
        }

    //interaction can be used in place of message, they share the same info, except author -> user
    //you have to reply to the interaction or else it sends an error message, even if it was executed fine
    //regular / command
    if (interaction.isChatInputCommand()) {
        if (!interaction.client.commands.get(interaction.commandName)) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        try {
            //parse cmd name
            let cmd = interaction.commandName;

            if (cmd == 'new') {
                // defer must be command-specific in order to determine if its ephemeral
                await interaction.deferReply({ephemeral: false});
                switch(await canInitiateNewGame(interaction)) {
                    case 0: 
                        console.log("Creating new game...");
                        switch (await createNewGame(interaction)) {
                            case 0:
                                break;
                            case GameInteractionErr.GameAlreadyExists:
                            case GameInteractionErr.GameAlreadyExistsInServer:
                                interaction.editReply({content: `A game already exists in this channel.`});
                            default:
                                interaction.editReply({content:"Something went wrong."});
                        }
                        break;
                    case GameInteractionErr.GameAlreadyExists:
                    case GameInteractionErr.GameAlreadyExistsInServer:
                        interaction.editReply({content: `A game already exists in this channel.`});
                        break;
                    default:
                        interaction.editReply({content:"Something went wrong."});
                }
            }
            else if (cmd == 'add') {
                let result = await addPrompt(interaction);
            }
            else if (cmd == 'profile') {
                let user = interaction.options.getUser(`user`);
                let user_id: string;
                if (!user) {
                    user_id = interaction.user.id;
                    user = await client.users.fetch(user_id);
                }
                else {
                    user_id = user.id;
                }
                let user_profile = await DO.getPlayer(user_id);
                if (user_profile == null) {
                    // create a new user profile
                    let new_profile = {"player_id": 0, "user": user_id, "q_submitted": 0, "response_total": 0, "response_correct": 0} as PlayerI;
                    await DO.insertPlayer(new_profile);
                    user_profile = await DO.getPlayer(user_id);
                }

                const embed = new EmbedBuilder().setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
                embed.setTitle(`**${user.username}'s Profile**`);
                let description = `\nTotal Responses: \`${user_profile!!.getResponseTotal()}\`\n \
                Correct Responses: \`${user_profile!!.getResponseCorrect()}\`\n \
                Submitted Questions: \`${user_profile!!.getQSubmitted()}\``;

                embed.setDescription(description);
                let message = await interaction.reply({embeds: [embed]});
            }
            else if (cmd == 'help') {
                let max_img_index = Math.floor(Math.random()*BCONST.MAXIMUS_IMAGES.length);
                let thumbnail = BCONST.MAXIMUS_IMAGES[max_img_index].url;
                const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
                embed.setTitle(`**Help Page**`);
                let description = `**General Information**\n \
                Welcome to the Barbie Trivia Bot. Every 24-48 hours, a question is sent for responses, and 23 hours later, the answer will be given. The focus of these questions is the core 2000 Barbie movies as well as Barbie Life in the Dreamhouse.\n\n
                **Commands**:\n \
                \`/new\` Starts a new trivia game. There can only be one per server.\n \
                \`/add\` Add new trivia to the database!\n \
                \`/profile\` See stats of yourself and friends!\n \
                There is currently no "stop" functionality. I apologize for the inconvinence.\n\n \
                **Bot Invite URL**\n \
                ${BCONST.DISCORD_URL}`;

                embed.setDescription(description);
                let message = await interaction.reply({embeds: [embed]});
            }
            // else if (cmd == 'add') {
            //     await interaction.deferReply({ephemeral: true});
            //     let e = await takeTurn(interaction, interaction.user.id);
            //     switch(e) {
            //         case 0:
            //             // worked
            //             break;
            //         case InteractionErr.GameDoesNotExist:
            //             interaction.editReply({content: `A game does not yet exist. Start a new one with \`/newgame\`.`});
            //             break;
            //         case InteractionErr.NotPlayersTurn:
            //             showTiles(interaction, interaction.user.id, "It is not your turn, but these are your current tiles.");
            //             // todo check errors of showTiles
            //             break;
            //         case InteractionErr.PlayerNotInGame:
            //             interaction.editReply({content: `Sorry, you are not a participant in this game. Ask the manager to add you.`});
            //             break;
            //         case InteractionErr.PlayerTilesDoNotExist:
            //         case InteractionErr.InvalidInputToSQL:
            //             interaction.editReply({content: `An error has occured and your request cannot be completed (maybe let alex know).`});
            //             break;
            //         case InteractionErr.TrainNotOpen:
            //         case InteractionErr.TileDoesNotExist:
            //         case InteractionErr.TrainAlreadyOpen:
            //         default:
            //             console.log("ERROR: something weird happened");
            //             throw e;
            //     }
            // }
            // else if (cmd == 'answer') {
            //     await interaction.deferReply({ephemeral: true});
            //     let e = await takeTurn(interaction, interaction.user.id);
            //     switch(e) {
            //         case 0:
            //             // worked
            //             break;
            //         case InteractionErr.GameDoesNotExist:
            //             interaction.editReply({content: `A game does not yet exist. Start a new one with \`/newgame\`.`});
            //             break;
            //         case InteractionErr.NotPlayersTurn:
            //             showTiles(interaction, interaction.user.id, "It is not your turn, but these are your current tiles.");
            //             // todo check errors of showTiles
            //             break;
            //         case InteractionErr.PlayerNotInGame:
            //             interaction.editReply({content: `Sorry, you are not a participant in this game. Ask the manager to add you.`});
            //             break;
            //         case InteractionErr.PlayerTilesDoNotExist:
            //         case InteractionErr.InvalidInputToSQL:
            //             interaction.editReply({content: `An error has occured and your request cannot be completed (maybe let alex know).`});
            //             break;
            //         case InteractionErr.TrainNotOpen:
            //         case InteractionErr.TileDoesNotExist:
            //         case InteractionErr.TrainAlreadyOpen:
            //         default:
            //             console.log("ERROR: something weird happened");
            //             throw e;
            //     }
            // }
            // else if (cmd == 'accept') {
            //     if (interaction.options.getBoolean("public")) await interaction.deferReply({ephemeral: false});
            //     else await interaction.deferReply({ephemeral: true});
            //     switch (await showBoard(interaction)) {
            //         case 0: break;
            //         case InteractionErr.GameDoesNotExist: 
            //             interaction.editReply({content: `Sorry, there is no game to show.`});
            //             break;
            //         case InteractionErr.TrainsDoNotExist:
            //         case InteractionErr.PlayerDoesNotExist:
            //         default:
            //             interaction.editReply({content: `Something went wrong.`});
            //     }
            // }
            else await interaction.editReply({ content: 'There was an error while executing this command.'});
    
        } catch (error) {
            console.error(`err17774: ${error}`);
            await interaction.editReply({ content: 'There was an error while executing this command.'});
        }
    }
    //a selection menu event was triggered 
    /*
    else if (interaction.isStringSelectMenu()) {
        interaction as StringSelectMenuInteraction;
        try {
            let cmd = interaction.customId;
            switch (cmd) {
                case TRAINC.TURN_PLAYEROPTION_MENU:
                case TRAINC.TURN_TILEOPTION_MENU:
                    selectPlayerTurnMenu(interaction).then((err: number) => {
                        switch(err) {
                            case 0: return;
                            case InteractionErr.PlayerNotInGame: 
                                interaction.reply({ 
                                    content: 'You cannot take a turn if you are not part of the game. Ask the game master [INSERT HERE] to add you.', 
                                    ephemeral: true });
                                break;
                            default:
                                interaction.reply({ 
                                    content: 'There was an error while executing this command.', 
                                    ephemeral: true });
                        }
                    })
                    break;
                default:
                    interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
            }
        } catch (error) {
            console.error(`err17776: ${error}`);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        };
    }
    else if (interaction.isButton()) {
        interaction as ButtonInteraction;
        try {
            let cmd = interaction.customId;
            switch(cmd) {
                case TRAINC.TURN_GO_BUTTON:
                    
                    let [result, replyID, str] = await pressGoButton(interaction);
                    switch (result) {
                        case 0: return;
                        case GoInteractionErr.NotPlayersTurn:
                            str = "Sorry, it's not your turn.";
                            break;
                        case GoInteractionErr.PlayerNotInGame:
                            str = "Sorry, you're not a part of the game. Please ask the game master to add you.";
                            break;
                        case GoInteractionErr.GameDoesNotExist:
                            str = "There is no game to play on.";
                            break;
                        case GoInteractionErr.InvalidTrainSelection:
                        case GoInteractionErr.InvalidTileSelection:
                        case GoInteractionErr.NoTileInput:
                        case GoInteractionErr.NoTrainInput:
                            break;
                        case GoInteractionErr.InvalidInputToSQL:
                        default:
                            str = "Something went wrong.";
                    }
                    console.log("get reply");
                    if (replyID == null) interaction.editReply(str);
                    else {
                        console.log("update");
                        interaction.update(str);
                    }
                    break;
                default:
                    interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
            }
        } catch (error) {
            console.error(`err17778: ${error}`);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        };
    }
    */
});

client.on('ready', async () => {
    // ## SLASH COMMANDS
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
        else console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
    console.log(`${client.user?.username} Online -- Version: ${BCONST.VERSION}`);

    // on start up, make sure that all the question_channels are running.
    if (!BCONST.USE_DEV) {
        startAllQuestionChannels(client);
    }
    else {
        let value = await DO.getAdmin("415315191547559936");
        console.log("value: ", value);
    }
    
    
});
/*
client.on("guildCreate", guild => {
    try {
        const embed = new Discord.EmbedBuilder().setTimestamp().setThumbnail(guild.iconURL()).setFooter({text: `MD is now in ${client.guilds.cache.size} servers.`})
        embed.title = 'Joined new server!'
        let e_desc = `**Server name**: ${guild.name}\n**Members**: ${guild.memberCount}`;
        embed.setDescription(e_desc); //v14, cant set description directly

        let logchannel = client.channels.cache.get((MonsterDuels.IS_TEST_BOT) ? MonsterDuelsConstants.LOG_privateTestChannelID_DEV : MonsterDuelsConstants.LOG_privateTestChannelID_REAL);
        logchannel.send({embeds: [embed]}).catch((e) => console.log('error sending server update msg: ' + e));
    }
    catch {
        console.log('error guildcreate?'); 
    }

});

client.on("guildDelete", function(guild){
    try {
        const embed = new Discord.EmbedBuilder().setTimestamp().setThumbnail(guild.iconURL()).setFooter({text: `MD is now in ${client.guilds.cache.size} servers.`})
        embed.title = 'Removed from server!'
        let e_desc = `**Server name**: ${guild.name}\n**Members**: ${guild.memberCount}`;
        embed.setDescription(e_desc); //v14, cant set description directly
    
        let logchannel = client.channels.cache.get((MonsterDuels.IS_TEST_BOT) ? MonsterDuelsConstants.LOG_privateTestChannelID_DEV : MonsterDuelsConstants.LOG_privateTestChannelID_REAL);
        logchannel.send({embeds: [embed]}).catch((e) => console.log('error sending server update msg: ' + e));
    }
    catch {
        console.log('error guilddelete?'); 
    }
});
*/

client.on('error', function (err) {
    throw err;
});

/*
function accountlessMessage(user, message) {
    return message.reply({content: 'You have no account yet, please use the `start` command to begin playing!', ephemeral: true});
}

//return string that is friendly for mdex, monster name etc... 'DeX' -> 'dex' | 'MR. sANdwichMAN' -> 'Mr. Sandwichman'
//wont work for regions because of names like RightIsland which have capitalization in the middle of the string
function stringToCorrectFormat(str) {
    if (typeof str != 'string') return str; 
    str = str.toLowerCase();
    return str.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}
*/
// login
client.login(BCONST.BOT_KEY);
