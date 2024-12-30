const { SlashCommandBuilder} = require('discord.js');
import { ChatInputCommandInteraction } from "discord.js";
import { CommandOption } from "../data/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setDescription('View a profile.')
        .addUserOption((option: CommandOption) =>
            option.setName('user')
                .setDescription('The user to view the profile of. If unspecified, assumes yourself.')
                .setRequired(false)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        //nothing here
    },
};