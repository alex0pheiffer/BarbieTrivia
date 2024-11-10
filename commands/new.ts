const { SlashCommandBuilder, ChannelType} = require('discord.js');
import { ChatInputCommandInteraction } from "discord.js";
import { CommandOption } from "./types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('new')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Start a new trivia game.')
        .addChannelOption((option: any) =>
            option.setName('channel')
                .setDescription('The channel to start the trivia.')
    			.addChannelTypes(ChannelType.GuildText)),
        //.addUserOption((option: PlayerOption) =>
        //),
    async execute(interaction: ChatInputCommandInteraction) {
        //nothing here
    },
};