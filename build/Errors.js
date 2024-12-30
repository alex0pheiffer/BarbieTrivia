"use strict";
// Error Enums for new games
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataErr = exports.StatErr = exports.GameInteractionErr = exports.InteractionErr = void 0;
/* Normal Game Interaction Errors (ie, player turns)  */
exports.InteractionErr = Object.freeze({ "GameDoesNotExist": 1, "InvalidInputToSQL": 2, "TileDoesNotExist": 3, "TrainAlreadyOpen": 4, "TrainNotOpen": 5, "PlayerDoesNotExist": 6, "PlayerTilesDoNotExist": 7, "PlayerNotInGame": 8, "NotPlayersTurn": 9, "TrainsDoNotExist": 10, "ReplyMessageDoesNotExist": 11, "RoundNotActive": 12 });
/* Game Interaction Errors */
exports.GameInteractionErr = Object.freeze({ "GameAlreadyExists": 1 });
/* Stat Errors */
exports.StatErr = Object.freeze({ "GameDoesNotExist": 1, "InvalidInputToSQL": 2, "EntryAlreadyExists": 3 });
/* Player Data Errors */
exports.DataErr = Object.freeze({ "IDDoesNotExist": 1, "InvalidInputToSQL": 2, "IDAlreadyExists": 3 });
