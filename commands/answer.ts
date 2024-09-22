const { SlashCommandBuilder} = require('discord.js');
import { ChatInputCommandInteraction } from "discord.js";
import { CommandOption } from "./types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('answer')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Response to an active question.')
        .addStringOption(option =>
            option.setName('Choice')
                .setDescription('(A,B,C,D)')
                .setRequired(true)
                .addChoices(
                    { name: 'A', value: 'Option A.' },
                    { name: 'B', value: 'Option B.' },
                    { name: 'C', value: 'Option C.' },
                    { name: 'D', value: 'Option D.'},
                )),
    async execute(interaction: ChatInputCommandInteraction) {
        //nothing here
    },
};