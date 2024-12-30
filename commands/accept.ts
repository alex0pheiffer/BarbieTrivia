const { SlashCommandBuilder} = require('discord.js');
import { ChatInputCommandInteraction } from "discord.js";
import { CommandOption } from "../data/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('accept')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Accept a suggested question. This is an admin-only command.')
        .addStringOption((option: CommandOption) =>
            option.setName('question')
                .setDescription('The question number to accept.')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        //nothing here
    },
};