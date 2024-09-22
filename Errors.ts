// Error Enums for new games

/* Normal Game Interaction Errors (ie, player turns)  */
export const InteractionErr = Object.freeze({ "GameDoesNotExist": 1, "InvalidInputToSQL": 2, "TileDoesNotExist": 3, "TrainAlreadyOpen": 4, "TrainNotOpen": 5, "PlayerDoesNotExist": 6, "PlayerTilesDoNotExist": 7, "PlayerNotInGame": 8, "NotPlayersTurn": 9, "TrainsDoNotExist": 10, "ReplyMessageDoesNotExist": 11, "RoundNotActive": 12});
/* Go Button Interaction on turn */
export const GoInteractionErr = Object.freeze({"GameDoesNotExist": 1, "InvalidInputToSQL": 2, "NoTrainInput": 3, "NoTileInput": 4, "NotPlayersTurn": 5, "PlayerNotInGame": 6, "InvalidTrainSelection": 7, "InvalidTileSelection": 8, "Stalemate": 9, "PlayerDoesNotExist": 10});
/* Stat Errors */
export const StatErr = Object.freeze({"GameDoesNotExist": 1, "InvalidInputToSQL": 2, "EntryAlreadyExists": 3});
/* Player Data Errors */
export const DataErr = Object.freeze({"IDDoesNotExist": 1, "InvalidInputToSQL": 2, "IDAlreadyExists": 3});