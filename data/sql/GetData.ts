// Retrieve data from the SQL database
import {SQLDATA} from "./CommandsSQL";
import {AdminI} from "../data_interfaces/admin";
import { AskedQuestionI } from "../data_interfaces/askedQuestion";
import { OwnerI } from "../data_interfaces/owner";
import { ProposalI } from "../data_interfaces/proposal";
import { QuestionI } from "../data_interfaces/question";
import { QuestionChannelI } from "../data_interfaces/questionChannel";

/* 
 * Retrieves data and returns as JSON
 *
*/
export class GetData {
    
    static async getAdmin(id: string): Promise<AdminI | null> {
        let $DATA = await SQLDATA.getGameSQL(id);
        if ($DATA == "") return null;
        else return JSON.parse($DATA) as GameI;
    }
    
    static async getGameTiles(id: string): Promise<Array<GameTileI>> {
        let $DATA = await SQLDATA.getGameTilesSQL(id);
        return $DATA as unknown as Array<GameTileI>; // hopefully this doesnt cause issues
    }
    
    static async getGameTrains(id: string): Promise<Array<GameTrainI>> {
        let $DATA = await SQLDATA.getGameTrainsSQL(id);
        return $DATA as unknown as Array<GameTrainI>; // idk this casting seems sus
    }

    static async getGameTrain(userID: string, gameID: string): Promise<GameTrainI | null> {
        // ok im going to be lazy ...
        // probably should make its own sql function
        let $DATA = await this.getGameTrains(gameID);
        let train = $DATA.find((t) => t.player == userID);
        if (train) return train;
        else return null;
    }

    static async getGameStats(gameID: string, startTime: number): Promise<Array<GameStatI>> {
        let $DATA = await SQLDATA.getGameStats(gameID, startTime);
        return $DATA as unknown as Array<GameStatI>; // hmm
    }

    static async getPlayer(userID: string): Promise<PlayerI | null> {
        let $DATA = await SQLDATA.getPlayer(userID);
        if ($DATA) return JSON.parse($DATA) as PlayerI;
        else return null;
    }

    static async getPlayerTiles(userID: string, gameID: string): Promise<Array<GameTileI>> {
        let $DATA = await SQLDATA.getPlayerTiles(userID, gameID);
        return $DATA as unknown as Array<GameTileI>;
    }

    static async getPlayerTurn(userID: string, gameID: string): Promise<PlayerTurnI | null> {
        let $DATA = await SQLDATA.getPlayerTurn(userID, gameID);
        if ($DATA) return JSON.parse($DATA) as PlayerTurnI;
        else return null;
    }
}