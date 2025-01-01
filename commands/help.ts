const { SlashCommandBuilder} = require('discord.js');
import { ChatInputCommandInteraction } from "discord.js";
import { CommandOption } from "../data/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Provides information on the Maximus bot.'),
    async execute(interaction: ChatInputCommandInteraction) {
        //nothing here
    },
};