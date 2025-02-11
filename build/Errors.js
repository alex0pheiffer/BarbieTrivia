"use strict";
// Error Enums for new games
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataErr = exports.GameInteractionErr = void 0;
/* Normal Game Interaction Errors (ie, player turns)  */
//export const InteractionErr = Object.freeze({ "GameDoesNotExist": 1, "InvalidInputToSQL": 2, "TileDoesNotExist": 3, "TrainAlreadyOpen": 4, "TrainNotOpen": 5, "PlayerDoesNotExist": 6, "PlayerTilesDoNotExist": 7, "PlayerNotInGame": 8, "NotPlayersTurn": 9, "TrainsDoNotExist": 10, "ReplyMessageDoesNotExist": 11, "RoundNotActive": 12});
/* Game Interaction Errors */
exports.GameInteractionErr = Object.freeze({ "GameAlreadyExists": 1, "GameAlreadyExistsInServer": 2, "GuildDataUnavailable": 3, "SQLConnectionError": 4, "NoNewQuestionAvailable": 5, "NoAnswerSelected": 6, "QuestionDoesNotExist": 7, "QuestionExpired": 8, "NoPlayerResponses": 9, "QuestionChannelDoesNotExist": 10, "GameDoesNotExist": 11 });
/* Player Data Errors */
exports.DataErr = Object.freeze({ "IDDoesNotExist": 201, "InvalidInputToSQL": 202, "IDAlreadyExists": 203, "URLNotImage": 204 });
