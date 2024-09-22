const { SlashCommandBuilder} = require('discord.js');
import { ChatInputCommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('accept')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Accept a suggested question. This is an admin-only command.')
        .addIntegerOption(option =>
            option.setName('Question')
                .setDescription('The question number to accept.')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        //nothing here
    },
};