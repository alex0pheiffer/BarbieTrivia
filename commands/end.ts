const { SlashCommandBuilder, ChannelType} = require('discord.js');
import { ChatInputCommandInteraction } from "discord.js";
import { CommandOption } from "../data/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('end')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Terminate the existing trivia game.'),
        //.addUserOption((option: PlayerOption) =>
        //),
    async execute(interaction: ChatInputCommandInteraction) {
        //nothing here
    },
};