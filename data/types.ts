import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction } from "discord.js"

export interface ICommandOption {
    _name: String,
    _description: String,
    _required: Boolean
}

export class CommandOption implements ICommandOption {
    _name: String = "";
    _description: String = "";
    _required: Boolean = false;

    public getName() {
        return this._name;
    }
    public getDescription() {
        return this._description;
    }
    public getRequired() {
        return this._required;
    }

    public setName(value: String) {
        this._name = value;
        return this;
    }
    public setDescription(value: String) {
        this._description = value;
        return this;
    }
    public setRequired(value: Boolean) {
        this._required = value;
        return this;
    }
}


export interface SlashCommand {
    command: SlashCommandBuilder | any,
    execute: (interaction : CommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number // in seconds
}
export interface Command {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    permissions: Array<PermissionResolvable>,
    aliases: Array<string>,
    cooldown?: number,
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        commands: Collection<string, Command>,
        cooldowns: Collection<string, number>
    }
}
