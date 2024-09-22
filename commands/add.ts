const { SlashCommandBuilder} = require('discord.js');
import { ChatInputCommandInteraction } from "discord.js";
import { PlayerOption } from "./types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Add a new question to the game.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The Barbie trivia question.')),
    async execute(interaction: ChatInputCommandInteraction) {
        //nothing here
    },
};