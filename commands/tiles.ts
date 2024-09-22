const { SlashCommandBuilder} = require('discord.js');
import { ChatInputCommandInteraction } from "discord.js";
import { PlayerOption } from "./types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tiles')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('View your own tiles.')
        //.addUserOption((option: PlayerOption) =>
        //),
        ,
    async execute(interaction: ChatInputCommandInteraction) {
        //nothing here
    },
};