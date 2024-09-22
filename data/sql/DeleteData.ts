// Retrieve data from the SQL database
import { EndGameErr } from "../../Errors";
import { GameTileI } from "../data_interfaces/gameTile";
import { GameTileO } from "../data_objects/gameTile";
import {SQLDATA} from "./CommandsSQL";

/* 
 * Deletes data from key
 *
*/
export class DeleteData {
    
    static async deleteWholeGame(gameID: string, players: Array<string>): Promise<number> {
        let result = await this.deleteGame(gameID);
        if (result) return result;
        result = await this.deleteGameTiles(gameID);
        if (result) return result;
        for (let i=0; i < players.length; i++) {
            result = await this.deletePlayerTiles(players[i], gameID, EndGameErr);
            if (result) return result;
            result = await this.deletePlayerturn(players[i], gameID);
            if (result) return result;
        }
        result = await this.deleteGameTrains(gameID);
        if (result) return result;
        
        return result;
    }

    static async deleteGame(gameID: string): Promise<number> {
        let result = await SQLDATA.deleteGame(gameID);
        return result;
    }
    
    // deletes all tiles
    static async deleteGameTiles(gameID: string): Promise<number> {
        let result = await SQLDATA.deleteGameTiles(gameID);
        return result;
    }
    
    // deletes all trains
    static async deleteGameTrains(gameID: string): Promise<number> {
        let result = await SQLDATA.deleteGameTrains(gameID);
        return result;
    }

    // deletes all tiles
    static async deletePlayerTiles(userID: string, gameID: string, errType: any): Promise<number> {
        let result = await SQLDATA.deletePlayerTiles(userID, gameID, errType);
        return result;
    }

    // deletes single tile
    static async deletePlayerTile(userID: string, gameID: string, s1: number, s2: number): Promise<number> {
        let result = await SQLDATA.deletePlayerTile(userID, gameID, s1, s2);
        return result;
    }

    static async deletePlayerturn(userID: string, gameID: string): Promise<number> {
        let result = await SQLDATA.deletePlayerTurn(userID, gameID);
        return result;
    }

    // deletes a single tile
    static async deleteGameTile(tile: GameTileI | GameTileO): Promise<number> {
        let result = await SQLDATA.deleteGameTile(tile);
        return result;
    }
}