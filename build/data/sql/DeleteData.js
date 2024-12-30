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
}
exports.DeleteData = DeleteData;
