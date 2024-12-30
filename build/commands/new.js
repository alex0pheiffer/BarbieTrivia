"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder, ChannelType } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('new')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Start a new trivia game.')
        .addChannelOption((option) => option.setName('chosen_channel')
        .setDescription('The channel to start the trivia.')
        .addChannelTypes(ChannelType.GuildText)),
    //.addUserOption((option: PlayerOption) =>
    //),
    async execute(interaction) {
        //nothing here
    },
};
