import { TURNTYPE } from "../component_interfaces/turn_player_options";
import { TurnTileOptionsI } from "../component_interfaces/turn_tile_options";
import { GameTilesO } from "../data_objects/gameTile";

const regexS1 = /\[ ([\d]+) \|/i
const regexS2 = /\[ \d\d? \| ([\d]+) \]/i;

export function createTileString(s1: number, s2: number): string {
    return `[ ${s1} | ${s2} ]`;
}

export class TurnTileOptionsO {
    turnType: number;
    // { userID: Array<string>, TRAINC.MEXICAN_TRAIN_NAME: Array<string>, etc}
    // where Array<string> are the tiles valid for that train
    private options: any;

    constructor(json: TurnTileOptionsI) {
        this.turnType = json.turnType;
        this.options = json.options;
    }

    public debugOption(userID: string): Array<string> {
        return this.options[userID];
    }

    public addOption(train: string, tiles: Array<string>) {
        this.options[train] = tiles;
    }

    // chosen train is in code-lingo (not display text)
    public async getShowOptions(playerTiles: GameTilesO, chosenTrain: string | null): Promise<Array<string>> {
        let arr = Array<string>();
        
        switch (this.turnType) {
            case TURNTYPE.Double:
                if (chosenTrain)
                    return this.options[chosenTrain];
            case TURNTYPE.Default:
            case TURNTYPE.Players:
            default:
                // convert all tiles to strings                
                playerTiles.tiles.forEach((t) => {
                    arr.push(createTileString(t.s1, t.s2));
                })
                return arr;
        }
    }

    public getTileNumbers(tile: string): Array<number> {
        let s1 = tile.match(regexS1)?.[1];
        let s2 = tile.match(regexS2)?.[1];
        if (!s1 || !s2) {
            console.log(`ERROR: given text not valid tile [${tile}]`);
            if (!s1) s1 = "-1";
            if (!s2) s2 = "-1";
        }
        return [Number(s1), Number(s2)];
    }

    // playerchoice is in code-lingo
    public isValid(choice: string, playerChoice: string): boolean {

        console.log(`isValid Prompt:\t${choice}\t${playerChoice}`);
        console.log(`options...${this.options}`);
        

        // check if the string is in the valid option list
        let player = this.options[playerChoice];
        if (!player) {
            console.log("player is false");
            return false;
        }

        console.log(player);
        return (player.find((s: string) => (s == choice))) ? true : false;
    }
}