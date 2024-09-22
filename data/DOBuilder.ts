import { GameO } from "./data_objects/game";
import { GameI } from "./data_interfaces/game";
import { GetData } from "./sql/GetData";
import { UpdateData } from "./sql/UpdateData";
import { InsertData } from "./sql/InsertData";
import { DeleteData } from "./sql/DeleteData";
import { GameTrainI } from "./data_interfaces/gameTrain";
import { GameTileI } from "./data_interfaces/gameTile";
import { GameTileO, GameTilesO } from "./data_objects/gameTile";
import { GameTrainO, GameTrainsO } from "./data_objects/gameTrain";
import { GameStatI } from "./data_interfaces/gameStats";
import { PlayerI } from "./data_interfaces/player";
import { GameStatsO } from "./data_objects/gameStats";
import { PlayerO } from "./data_objects/player";
import { PlayerTurnO } from "./data_objects/playerTurn";

export class DO {

    /*
     *  Get Functions
     *
     * 
     */
    
    static async getGame(gameID: string): Promise<GameO | null> {
        let game: GameO;
        let gamejson = await GetData.getGame(gameID);
        if (gamejson) {
            game = new GameO(gamejson);
            return game;
        }
        return null;
    }

    static async getGameTiles(gameID: string): Promise<GameTilesO | null> {
        let gameTiles: GameTilesO;
        let gameTilesjsons = await GetData.getGameTiles(gameID);
        if (gameTilesjsons.length > 0) {
            gameTiles = new GameTilesO(gameTilesjsons);
            return gameTiles;
        }
        return null;
    }

    static async getGameTrains(gameID: string): Promise<GameTrainsO | null> {
        let gameTrains: GameTrainsO;
        let gameTrainsjsons = await GetData.getGameTrains(gameID);
        if (gameTrainsjsons.length > 0) {
            gameTrains = new GameTrainsO(gameTrainsjsons);
            return gameTrains;
        }
        return null;
    }

    static async getGameTrain(userID: string, gameID: string): Promise<GameTrainO | null> {
        let gameTrain: GameTrainO;
        let gameTrainjson = await GetData.getGameTrain(userID, gameID);
        if (gameTrainjson)
            return new GameTrainO(gameTrainjson);
        return null;
    }

    static async getGameStats(gameID: string, startTime: number): Promise<GameStatsO | null> {
        let gameStats: GameStatsO;
        let gameStatsjsons = await GetData.getGameStats(gameID, startTime);
        if (gameStatsjsons.length > 0) {
            gameStats = new GameStatsO(gameStatsjsons);
            return gameStats;
        }
        return null;
    }

    static async getPlayer(userID: string): Promise<PlayerO | null> {
        let playerjson = await GetData.getPlayer(userID);
        if (playerjson) return new PlayerO(playerjson);
        else return null;
    }

    static async getPlayerTiles(userID: string, gameID: string): Promise<GameTilesO | null> {
        let tiles: GameTilesO;
        let tilejsons = await GetData.getPlayerTiles(userID, gameID);
        if (tilejsons.length > 0) {
            tiles = new GameTilesO(tilejsons);
            return tiles;
        }
        return null;
    }

    static async getPlayerTurn(userID: string, gameID: string): Promise<PlayerTurnO | null> {
        let turnJson  = await GetData.getPlayerTurn(userID, gameID);
        if (turnJson) return new PlayerTurnO(turnJson);
        return null; 
    }

    /*
     *  Update Functions
     *
     * 
     */

    static async updateGame(game: GameO, errType: any): Promise<number> {
        return await UpdateData.updateGame(game, errType);
    }

    static async updatePlayerTurn(turn: PlayerTurnO): Promise<number> {
        return await UpdateData.updatePlayerturn(turn);
    }

    static async updateGameTrains(trains: GameTrainsO, errType: any): Promise<number> {
        return await UpdateData.updateGameTrains(trains, errType);
    }

    static async updatePlayer(player: PlayerO, errType: any): Promise<number> {
        return await UpdateData.updatePlayer(player, errType);
    }
    
    /*
     *  Insert Functions
     *
     * 
     */
        
    // returns a NewGameErr if not 0
    static async insertGame(game: GameI): Promise<number> {
        return await InsertData.insertGame(game);
    }

    // returns a NewGameErr if not 0
    static async insertGameTile(gameID: string, s1: number, s2: number): Promise<number> {
        return await InsertData.insertGameTiles(gameID, s1, s2);
    }

    // returns a NewGameErr if not 0
    static async insertGameTrain(train: GameTrainI): Promise<number> {
        return await InsertData.insertGameTrains(train);
    }

    static async insertGameStats(stats: GameStatI, errType: any): Promise<number> {
        return await InsertData.insertGameRoundStats(stats, errType);
    }

    static async insertPlayer(player: PlayerI): Promise<number> {
        return await InsertData.insertPlayer(player);
    }

    static async insertPlayerTiles(userID: string, tiles: Array<GameTileO>): Promise<number> {
        return await InsertData.insertPlayerTiles(userID, tiles);
    }

    static async insertPlayerTile(userID: string, tile: GameTileO): Promise<number> {
        return await InsertData.insertPlayerTile(userID, tile);
    }

    static async insertPlayerTurn(userID: string, gameID: string): Promise<number> {
        return await InsertData.insertPlayerTurn(userID, gameID);
    }

    /*
     *  Delete Functions
     *
     * 
     */

    // returns an EndGameErr if not 0
    static async deleteWholeGame(gameID: string, players: Array<string>): Promise<number> {
        return await DeleteData.deleteWholeGame(gameID, players);
    }

    static async deleteGameTiles(gameID: string): Promise<number> {
        return await DeleteData.deleteGameTiles(gameID);
    }

    static async deleteGameTile(tile: GameTileI | GameTileO): Promise<number> {
        return await DeleteData.deleteGameTile(tile);
    }

    static async deletePlayerTiles(userID: string, gameID: string, errType: any): Promise<number> {
        return await DeleteData.deletePlayerTiles(userID, gameID, errType);
    }

    static async deletePlayerTile(userID: string, tile: GameTileO): Promise<number> {
        return await DeleteData.deletePlayerTile(userID, tile.gameID, tile.s1, tile.s2);
    }

    // overload function :
    static async deletePlayerTile_(userID: string, gameID: string, s1: number, s2: number): Promise<number> {
        return await DeleteData.deletePlayerTile(userID, gameID, s1, s2);
    }
    
}
