"use strict";
// **** this doesnt need to be part of app.js, 
// **** just run node DeployCommands.js in the terminal
Object.defineProperty(exports, "__esModule", { value: true });
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const BCONST_1 = require("./BCONST");
async function deploy_commands() {
    const token = BCONST_1.BCONST.BOT_KEY;
    const clientID = BCONST_1.BCONST.CLIENT_ID;
    const DISABLE_ALL_COMMANDS = false;
    var commands = [];
    // Grab all the command files from the commands directory you created earlier
    const commandFiles = await fs.readdirSync('./build/commands').filter((file) => (file.endsWith('.js')));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(token);
    // and deploy your commands!
    (async () => {
        try {
            if (DISABLE_ALL_COMMANDS)
                commands = [];
            console.log(`Started refreshing ${commands.length} application (/) commands. DISABLE_ALL_COMMANDS = ${DISABLE_ALL_COMMANDS}.`);
            let data;
            //this one updates it for all servers
            data = await rest.put(Routes.applicationCommands(clientID), { body: commands });
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        catch (error) {
            console.error(error);
        }
    })();
}
deploy_commands();
