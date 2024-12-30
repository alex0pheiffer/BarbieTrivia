"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('accept')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('Accept a suggested question. This is an admin-only command.')
        .addStringOption((option) => option.setName('question')
        .setDescription('The question number to accept.')
        .setRequired(true)),
    async execute(interaction) {
        //nothing here
    },
};
