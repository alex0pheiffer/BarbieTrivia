"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteData = void 0;
// Retrieve data from the SQL database
const CommandsSQL_1 = require("./CommandsSQL");
/*
 * Deletes data from key
 *
*/
class DeleteData {
    static async deleteAdmin(userID) {
        let result = await CommandsSQL_1.SQLDATA.deleteAdmin(userID);
        return result;
    }
    static async deleteProposal(proposalID) {
        let result = await CommandsSQL_1.SQLDATA.deleteProposal(proposalID);
        return result;
    }
    static async deleteQuestionChannel(channel) {
        let result = await CommandsSQL_1.SQLDATA.deleteQuestionChannel(channel);
        return result;
    }
    static async deletePlayerAnswer(answer_id) {
        let result = await CommandsSQL_1.SQLDATA.deletePlayerAnswer(answer_id);
        return result;
    }
    static async deleteAskedQuestion(ask_id) {
        let result = await CommandsSQL_1.SQLDATA.deleteAskedQuestion(ask_id);
        return result;
    }
}
exports.DeleteData = DeleteData;
