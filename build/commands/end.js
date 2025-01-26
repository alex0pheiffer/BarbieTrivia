"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder, ChannelType } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('end')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Terminate the existing trivia game.'),
    //.addUserOption((option: PlayerOption) =>
    //),
    async execute(interaction) {
        //nothing here
    },
};
