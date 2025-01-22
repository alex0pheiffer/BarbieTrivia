"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const path = require('node:path');
const BCONST_1 = require("./BCONST");
const DOBuilder_1 = require("./data/DOBuilder");
const new_1 = require("./new");
const Errors_1 = require("./Errors");
const prompt_1 = require("./prompt");
const startup_1 = require("./startup");
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.MessageContent, discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.GuildMembers, discord_js_1.GatewayIntentBits.GuildMessageReactions]
});
client.slashCommands = new discord_js_1.Collection();
client.commands = new discord_js_1.Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
    /*
        // fail this nicer later
        if (!(interaction.isCommand() && interaction.isUserContextMenuCommand())) return -1;
        interaction = (<ChatInputCommandInteraction>interaction);
    */
    //check permissions (we have to check viewchannel for interactions..)
    if (!interaction.guild?.members.me?.permissionsIn(interaction.channelId).has(discord_js_1.PermissionsBitField.Flags.ViewChannel)) {
        interaction.reply({ content: 'Bot does not have permission to **view** this channel. :frowning2:', ephemeral: true });
        return;
    }
    else if (!interaction.guild.members.me.permissionsIn(interaction.channelId).has(discord_js_1.PermissionsBitField.Flags.SendMessages)) {
        interaction.reply({ content: 'Bot does not have permission to **send messages** in this channel. :frowning2:', ephemeral: true });
        return;
    }
    else if (!interaction.guild.members.me.permissionsIn(interaction.channelId).has(discord_js_1.PermissionsBitField.Flags.EmbedLinks)) {
        interaction.reply({ content: 'Bot does not have permission to **embed links** in this channel. :frowning2:', ephemeral: true });
        return;
    }
    else if (!interaction.guild.members.me.permissionsIn(interaction.channelId).has(discord_js_1.PermissionsBitField.Flags.UseExternalEmojis)) {
        interaction.reply({ content: 'Bot does not have permission to **use external emojis** in this channel. :frowning2:', ephemeral: true });
        return;
    }
    else if (!interaction.guild.members.me.permissionsIn(interaction.channelId).has(discord_js_1.PermissionsBitField.Flags.AddReactions)) {
        interaction.reply({ content: 'Bot does not have permission to **add reactions** in this channel. :frowning2:', ephemeral: true });
        return;
    }
    else if (!interaction.guild.members.me.permissionsIn(interaction.channelId).has(discord_js_1.PermissionsBitField.Flags.ManageMessages)) {
        interaction.reply({ content: 'Bot does not have permission to **manage messages** in this channel. :frowning2:', ephemeral: true });
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
                await interaction.deferReply({ ephemeral: false });
                switch (await (0, new_1.canInitiateNewGame)(interaction)) {
                    case 0:
                        console.log("Creating new game...");
                        switch (await (0, new_1.createNewGame)(interaction)) {
                            case 0:
                                break;
                            case Errors_1.GameInteractionErr.GameAlreadyExists:
                            case Errors_1.GameInteractionErr.GameAlreadyExistsInServer:
                                interaction.editReply({ content: `A game already exists in this channel.` });
                            default:
                                interaction.editReply({ content: "Something went wrong." });
                        }
                        break;
                    case Errors_1.GameInteractionErr.GameAlreadyExists:
                    case Errors_1.GameInteractionErr.GameAlreadyExistsInServer:
                        interaction.editReply({ content: `A game already exists in this channel.` });
                        break;
                    default:
                        interaction.editReply({ content: "Something went wrong." });
                }
            }
            else if (cmd == 'add') {
                let result = await (0, prompt_1.addPrompt)(interaction);
            }
            else if (cmd == 'profile') {
                let user = interaction.options.getUser(`user`);
                let user_id;
                if (!user) {
                    user_id = interaction.user.id;
                    user = await client.users.fetch(user_id);
                }
                else {
                    user_id = user.id;
                }
                let user_profile = await DOBuilder_1.DO.getPlayer(user_id);
                if (user_profile == null) {
                    // create a new user profile
                    let new_profile = { "player_id": 0, "user": user_id, "q_submitted": 0, "response_total": 0, "response_correct": 0 };
                    await DOBuilder_1.DO.insertPlayer(new_profile);
                    user_profile = await DOBuilder_1.DO.getPlayer(user_id);
                }
                const embed = new discord_js_1.EmbedBuilder().setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
                embed.setTitle(`**${user.username}'s Profile**`);
                let description = `\nTotal Responses: \`${user_profile.getResponseTotal()}\`\n\
                Correct Responses: \`${user_profile.getResponseCorrect()}\`\n\
                Submitted Questions: \`${user_profile.getQSubmitted()}\``;
                embed.setDescription(description);
                let message = await interaction.reply({ embeds: [embed] });
            }
            else if (cmd == 'help') {
                let max_img_index = Math.floor(Math.random() * BCONST_1.BCONST.MAXIMUS_IMAGES.length);
                let thumbnail = BCONST_1.BCONST.MAXIMUS_IMAGES[max_img_index].url;
                const embed = new discord_js_1.EmbedBuilder().setTimestamp().setThumbnail(thumbnail).setFooter({ text: 'Barbie Trivia', iconURL: BCONST_1.BCONST.LOGO });
                embed.setTitle(`**Help Page**`);
                let description = `**General Information**\n \
                Welcome to the Barbie Trivia Bot. Every 24-48 hours, a question is sent for responses, and 23 hours later, the answer will be given. The focus of these questions is the core 2000 Barbie movies as well as Barbie Life in the Dreamhouse.\n\n
                **Commands**:\n \
                \`/new\` Starts a new trivia game. There can only be one per server.\n \
                \`/add\` Add new trivia to the database!\n \
                \`/profile\` See stats of yourself and friends!\n \
                There is currently no "stop" functionality. I apologize for the inconvinence.\n\n \
                **Bot Invite URL**\n \
                ${BCONST_1.BCONST.DISCORD_URL}`;
                embed.setDescription(description);
                let message = await interaction.reply({ embeds: [embed] });
            }
            else
                await interaction.editReply({ content: 'There was an error while executing this command.' });
        }
        catch (error) {
            console.error(`main interaction loop error: ${error}`);
            if (error)
                await interaction.editReply({ content: 'There was an error while executing this command.' });
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
        else
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
    console.log(`${client.user?.username} Online -- Version: ${BCONST_1.BCONST.VERSION}`);
    // on start up, make sure that all the question_channels are running.
    if (!BCONST_1.BCONST.USE_DEV) {
        (0, startup_1.startAllQuestionChannels)(client);
    }
    else {
        // bug testing on "Just Fungus"   
        console.log(await DOBuilder_1.DO.getAdmin("415315191547559936"));
    }
});
client.on('error', async (err) => {
    console.log("A main routine error has occured with the client. This is probably a network timeout (?).");
    console.log(err);
});
// login
client.login(BCONST_1.BCONST.BOT_KEY);
