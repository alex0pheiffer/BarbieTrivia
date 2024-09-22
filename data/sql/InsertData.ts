// Retrieve data from the SQL database
import {SQLDATA} from "./CommandsSQL";
import {GameI} from "../data_interfaces/game";
import { GameTrainI } from "../data_interfaces/gameTrain";
import { GameStatI } from "../data_interfaces/gameStats";
import { PlayerI } from "../data_interfaces/player";
import { GameTileO } from "../data_objects/gameTile";
import { InteractionErr, NewGameErr } from "../../Errors";
/* 
 * Inserts data from JSON
 *
*/
export class InsertData {
    
    static async insertGame(newGame: GameI): Promise<number> {
        let result = await SQLDATA.insertGame(newGame);
        return result;
    }
    
    static async insertGameTiles(gameID: string, s1: number, s2: number): Promise<number> {
        let result = await SQLDATA.insertGameTile(gameID, s1, s2);
        return result;
    }
    
    static async insertGameTrains(newTrain: GameTrainI): Promise<number> {
        let result = await SQLDATA.insertGameTrain(newTrain);
        return result;
    }

    static async insertGameRoundStats(newStats: GameStatI, errType: any): Promise<number> {
        let result = await SQLDATA.insertGameStats(newStats, errType);
        return result;
    }
    
    static async insertPlayer(player: PlayerI): Promise<number> {
        let result = await SQLDATA.insertPlayer(player);
        return result;
    }

    static async insertPlayerTiles(userID: string, tiles: Array<GameTileO>): Promise<number> {
        let result: number = 0;
        for (let i=0; i<tiles.length; i++) {
            result = await SQLDATA.insertPlayerTile(userID, tiles[i].gameID, tiles[i].s1, tiles[i].s2, NewGameErr);
            if (result) return result;
        }
        return result;
    }

    static async insertPlayerTile(userID: string, tile: GameTileO): Promise<number> {
        let result = await SQLDATA.insertPlayerTile(userID, tile.gameID, tile.s1, tile.s2, InteractionErr);
        return result;
    }

    static async insertPlayerTurn(userID: string, gameID: string): Promise<number> {
        let result = await SQLDATA.insertPlayerTurn(userID, gameID, null);
        return result;
    }
}