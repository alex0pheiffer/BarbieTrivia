"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Provides information on the Maximus bot.'),
    async execute(interaction) {
        //nothing here
    },
};
