const { SlashCommandBuilder} = require('discord.js');
import { ChatInputCommandInteraction } from "discord.js";
import { CommandOption } from "../data/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Add a new question to the game.'),
    async execute(interaction: ChatInputCommandInteraction) {
        //nothing here
    },
};