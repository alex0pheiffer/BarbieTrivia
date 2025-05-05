import { ButtonInteraction, CacheType, Channel, ChatInputCommandInteraction, Client, Collection, EmbedBuilder, Events, GatewayIntentBits, Interaction, PermissionsBitField, StringSelectMenuInteraction, TextChannel } from "discord.js";
import * as fs from "fs";
const path = require('node:path');
import { BCONST }    from "./BCONST";
import { Command, SlashCommand } from "./data/types";
import { DO } from "./data/DOBuilder";
import { canInitiateNewGame, createNewGame, createNewQuestion } from "./new";
import { GameInteractionErr } from "./Errors";
import { addPrompt } from "./prompt";
import { PlayerI } from "./data/data_interfaces/player";
import { startAllQuestionChannels } from "./startup";
import { PlayerAnswerI } from "./data/data_interfaces/playerAnswer";
import { AskedQuestionI } from "./data/data_interfaces/askedQuestion";
import { QuestionChannelI } from "./data/data_interfaces/questionChannel";
import { getGameInQuestionToEnd, hasPermissionToEnd } from "./end";

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
        // if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.ViewChannel)) {
        //     (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **view** this channel. :frowning2:', ephemeral: true});
        //     return;
        // }
        // else if (!interaction.guild.members.me.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.SendMessages)) {
        //     (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **send messages** in this channel. :frowning2:', ephemeral: true});
        //     return;
        // }
        // else if (!interaction.guild.members.me.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.EmbedLinks)) {
        //     (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **embed links** in this channel. :frowning2:', ephemeral: true});
        //     return;
        // }
        // else if (!interaction.guild.members.me.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.UseExternalEmojis)) {
        //     (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **use external emojis** in this channel. :frowning2:', ephemeral: true});   
        //     return;
        // }
        // else if (!interaction.guild.members.me.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.AddReactions))  {
        //     (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **add reactions** in this channel. :frowning2:', ephemeral: true});
        //     return;
        // }
        // else if (!interaction.guild.members.me.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.ManageMessages))  {
        //     (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **manage messages** in this channel. :frowning2:', ephemeral: true});        
        //     return;
        // }

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
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.SendMessages)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **send messages** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.EmbedLinks)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **embed links** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.ViewChannel)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **view channel** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.ReadMessageHistory)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **read message history** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
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
                                interaction.editReply({content: `A game already exists in this server.`});
                            default:
                                interaction.editReply({content:"Something went wrong."});
                        }
                        break;
                    case GameInteractionErr.GameAlreadyExists:
                    case GameInteractionErr.GameAlreadyExistsInServer:
                        interaction.editReply({content: `A game already exists in this server.`});
                        break;
                    default:
                        interaction.editReply({content:"Something went wrong."});
                }
            }
            else if (cmd == 'end') {
                await interaction.deferReply({ephemeral: false});
                let result = 0;
                let q_ch = await getGameInQuestionToEnd(interaction);
                result = q_ch[1];
                if (q_ch[0] && !result) {
                    let can_end = await hasPermissionToEnd(interaction.user.id, q_ch[0], interaction.client);
                    if (can_end) {
                        // delete the current question
                        let latest_question = await DO.getLatestAskedQuestion(q_ch[0].getChannel());
                        if (latest_question.length > 0) {
                            console.log("Latest ask_id: ", latest_question[0].getAskID());
                            if (latest_question[0].getActive()) {
                                result = await DO.deleteAskedQuestion(latest_question[0].getAskID())
                            }
                        }
                        
                        // delete the latest responses
                        // do not delete the question_channel
                        // insteady, deactivate it
                        // a channel is de-active if it has no owner
                        q_ch[0].setOwner("");
                        result = await DO.updateQuestionChannel(q_ch[0], result);
                        interaction.editReply({content: `The Barbie Trivia Game has been terminated. Use the /new    command to continue the game.`})
                    }
                    else {
                        interaction.editReply({content: `You must be the owner or a trivia admin to end a game. Please ask the owner <@${q_ch[0].getOwner()}> to end the game instead..`});
                    }
                }
                else {
                    interaction.editReply({content: 'Cannot terminate trivia game because no game exists.'});
                }
            }
            else if (cmd == 'add') {
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.SendMessages)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **send messages** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.EmbedLinks)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **embed links** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.ViewChannel)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **view channel** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
                if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId!).has(PermissionsBitField.Flags.ReadMessageHistory)) {
                    (<ChatInputCommandInteraction>interaction).reply({content: 'Bot does not have permission to **read message history** in this channel. :frowning2:', ephemeral: true});
                    return;
                }   
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
                let description = `\nTotal Responses: \`${user_profile!!.getResponseTotal()}\`\n\
                Correct Responses: \`${user_profile!!.getResponseCorrect()}\`\n\
                Submitted Questions: \`${user_profile!!.getQSubmitted()}\``;

                embed.setDescription(description);
                let message = await interaction.reply({embeds: [embed]});
            }
            else if (cmd == 'help') {
                let max_img_index = Math.floor(Math.random()*BCONST.MAXIMUS_IMAGES.length);
                let thumbnail = BCONST.MAXIMUS_IMAGES[max_img_index].url;
                // get the total number of questions
                let q_list = await DO.getAllQuestions();
                let q_from_server = 0;
                if (interaction.guildId) {
                    let this_server = await DO.getQuestionChannelByServer(interaction.guildId);
                    for (let i=0; i < this_server.length; i++) {
                        let s = this_server[i];
                        if (s.getOwner().length > 0) {
                            q_from_server = s.getQuestionsAsked();
                            break;
                        }
                    }
                }
                const embed = new EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({text: 'Barbie Trivia', iconURL: BCONST.LOGO});
                embed.setTitle(`**Help Page**`);
                let description = `**General Information**\n \
                Welcome to the Fan-Made Barbie Trivia Bot. Every 24-48 hours, a question is sent for responses, and 23 hours later, the answer will be given. The focus of these questions is the core 2000s-2010s Barbie movies as well as Barbie Life in the Dreamhouse.\n
                Currently there are ${q_list.length} total questions in circulation, and ${Math.floor(q_from_server / q_list.length*100)}% have been displayed in this server.\n\n
                **Commands**:\n \
                \`/new\` Starts a new trivia game. There can only be one per server.\n \
                \`/end\` End an existing trivia game. It can be continued later with \`/new\`.\n \
                \`/add\` Add new trivia to the database! (Screened by admins).\n \
                \`/profile\` See stats of yourself and friends!\n \
                \n \
                **Bot Invite URL**\n \
                ${BCONST.DISCORD_URL}`;

                embed.setDescription(description);
                let message = await interaction.reply({embeds: [embed]});
            }
            else await interaction.editReply({ content: 'There was an error while executing this command.'});
    
        } catch (error) {
            console.error(`main interaction loop error: ${error}`);
            if (error )
            await interaction.editReply({ content: 'There was an error while executing this command.'});
        }
    }
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
    if (true || !BCONST.USE_DEV) {
        startAllQuestionChannels(client);
    }
    else {
        // bug testing on "Just Fungus"   
        //console.log(await DO.getAdmin("415315191547559936"))
        //createNewQuestion("1266960173533237268", "1325514408822308958", client, 454)
    }
});

client.on('error', async(err: any) => {
    console.log("A main routine error has occured with the client. This is probably a network timeout (?).");
    console.log(err);
});

// login
client.login(BCONST.BOT_KEY);
