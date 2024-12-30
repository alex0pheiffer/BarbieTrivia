// **** this doesnt need to be part of app.js, 
// **** just run node DeployCommands.js in the terminal

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
import { BCONST } from "./BCONST";

async function deploy_commands(): Promise<void> {

    const token = BCONST.BOT_KEY;
    const clientID = BCONST.CLIENT_ID;
    const DISABLE_ALL_COMMANDS = false;

    var commands = [];
    // Grab all the command files from the commands directory you created earlier
    const commandFiles = await fs.readdirSync('./build/commands').filter((file: String) => (file.endsWith('.js')));

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
            if (DISABLE_ALL_COMMANDS) commands = [];
            console.log(`Started refreshing ${commands.length} application (/) commands. DISABLE_ALL_COMMANDS = ${DISABLE_ALL_COMMANDS}.`);

            let data;
            //this one updates it for all servers
            data = await rest.put(
                Routes.applicationCommands(clientID),
                { body: commands }
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();

}

deploy_commands();