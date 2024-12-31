"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertData = void 0;
const CommandsSQL_1 = require("./CommandsSQL");
/*
 * Inserts data from JSON
 *
*/
class InsertData {
    static async insertProposal(proposal) {
        let result = await CommandsSQL_1.SQLDATA.insertProposal(proposal);
        return result;
    }
    static async insertQuestion(question) {
        let result = await CommandsSQL_1.SQLDATA.insertQuestion(question);
        return result;
    }
    static async insertAdmin(admin) {
        let result = await CommandsSQL_1.SQLDATA.insertAdmin(admin);
        return result;
    }
    static async insertAskedQuestion(question) {
        let result = await CommandsSQL_1.SQLDATA.insertAskedQuestion(question);
        return result;
    }
    static async insertQuestionChannel(channel) {
        let result = await CommandsSQL_1.SQLDATA.insertQuestionChannel(channel);
        return result;
    }
    static async insertPlayerAnswer(answer) {
        let result = await CommandsSQL_1.SQLDATA.insertPlayerAnswer(answer);
        return result;
    }
    static async insertPlayer(player) {
        let result = await CommandsSQL_1.SQLDATA.insertPlayer(player);
        return result;
    }
}
exports.InsertData = InsertData;
