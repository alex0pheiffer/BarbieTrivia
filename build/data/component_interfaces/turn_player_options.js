"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMap = exports.TURNTYPE = void 0;
exports.TURNTYPE = Object.freeze({ "Default": 0, "Players": 1, "Double": 2 });
// turn types:
//  Default: yourself or mexican train
//  Players: yourself, mexican train, or some open trains
//  Double: only the current double (or draw)
// maps player_username_shown to userID
class PlayerMap {
    username;
    userID;
    constructor() {
        this.username = new Array();
        this.userID = new Array();
    }
    getUserID(username) {
        let index = this.username.indexOf(username);
        if (index < 0)
            return null;
        return this.userID[index];
    }
    getUsername(userID) {
        let index = this.userID.indexOf(userID);
        if (index < 0)
            return null;
        return this.username[index];
    }
    addUser(username, userID) {
        this.username.push(username);
        this.userID.push(userID);
    }
}
exports.PlayerMap = PlayerMap;
