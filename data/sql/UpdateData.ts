// Retrieve data from the SQL database
import {SQLDATA} from "./CommandsSQL";
import {GameI} from "../data_interfaces/game";
import { GameO } from "../data_objects/game";
import { PlayerTurnO } from "../data_objects/playerTurn";
import { GameTrainO, GameTrainsO } from "../data_objects/gameTrain";
import { PlayerO } from "../data_objects/player";

/* 
 * Updates data from JSONs
 *
*/
export class UpdateData {

    static async updateGame(game: GameO, errType: any): Promise<number> {
        let result = await SQLDATA.updateGame(game, errType);
        return result;
    }

    static async updateGameTiles(id: string) {
        /*
        let $DATA = await SQLDATA.getGameTilesSQL(id);
        if ($DATA == "") return null;
        else return JSON.parse($DATA);
        */
    }

    static async updateGameTrains(trains: GameTrainsO, errType: any): Promise<number> {
        let result: number = 0;
        let train: GameTrainO;
        for (let i=0; i < trains.trains.length; i++) {
            train = trains.trains[i];
            result = await SQLDATA.updateGameTrain(train, errType);
            if (result) return result;
        }
        return result;
    }

    static async updatePlayerturn(turn: PlayerTurnO): Promise<number> {
        let result = await SQLDATA.updatePlayerTurn(turn);
        return result;
    }

    static async updatePlayer(player: PlayerO, errType: any): Promise<number> {
        let result = await SQLDATA.updatePlayer(player, errType);
        return result;
    }
}