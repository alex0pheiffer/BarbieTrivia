"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Add a new question to the game.'),
    async execute(interaction) {
        //nothing here
    },
};
