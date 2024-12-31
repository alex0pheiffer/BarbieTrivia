"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateData = void 0;
const CommandsSQL_1 = require("./CommandsSQL");
/*
 * Updates data from JSONs
 *
*/
class UpdateData {
    static async updateProposal(proposal, errType) {
        let result = await CommandsSQL_1.SQLDATA.updateProposal(proposal, errType);
        return result;
    }
    static async updateQuestion(question, errType) {
        let result = await CommandsSQL_1.SQLDATA.updateQuestion(question, errType);
        return result;
    }
    static async updateAskedQuestion(question, errType) {
        let result = await CommandsSQL_1.SQLDATA.updateAskedQuestion(question, errType);
        return result;
    }
    static async updatePlayerAnswer(answer, errType) {
        let result = await CommandsSQL_1.SQLDATA.updatePlayerAnswer(answer, errType);
        return result;
    }
}
exports.UpdateData = UpdateData;
