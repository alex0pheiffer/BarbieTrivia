"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandOption = void 0;
class CommandOption {
    _name = "";
    _description = "";
    _required = false;
    getName() {
        return this._name;
    }
    getDescription() {
        return this._description;
    }
    getRequired() {
        return this._required;
    }
    setName(value) {
        this._name = value;
        return this;
    }
    setDescription(value) {
        this._description = value;
        return this;
    }
    setRequired(value) {
        this._required = value;
        return this;
    }
}
exports.CommandOption = CommandOption;
