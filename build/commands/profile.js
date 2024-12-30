"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('View a profile.')
        .addUserOption((option) => option.setName('user')
        .setDescription('The user to view the profile of. If unspecified, assumes yourself.')
        .setRequired(false)),
    async execute(interaction) {
        //nothing here
    },
};
