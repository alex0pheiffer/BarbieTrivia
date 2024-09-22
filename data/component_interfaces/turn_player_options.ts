export const TURNTYPE = Object.freeze({ "Default": 0, "Players": 1, "Double": 2});
// turn types:
//  Default: yourself or mexican train
//  Players: yourself, mexican train, or some open trains
//  Double: only the current double (or draw)


// maps player_username_shown to userID
export class PlayerMap {
    private username: Array<string>;
    private userID: Array<string>;
    constructor() {
        this.username = new Array<string>();
        this.userID = new Array<string>();
    }

    public getUserID(username: string): string | null {
        let index = this.username.indexOf(username);
        if (index < 0) return null;
        return this.userID[index];
    }

    public getUsername(userID: string): string | null {
        let index = this.userID.indexOf(userID);
        if (index < 0) return null;
        return this.username[index];
    }

    public addUser(username: string, userID: string) {
        this.username.push(username);
        this.userID.push(userID);
    }

}


export interface TurnPlayerOptionsI {
    // turn type (shown options)
    turnType: number;
    // actual options (valid options a player could choose)
    options: Array<string>;
}