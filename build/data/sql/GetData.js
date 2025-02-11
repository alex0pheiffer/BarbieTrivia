"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetData = void 0;
// Retrieve data from the SQL database
const CommandsSQL_1 = require("./CommandsSQL");
/*
 * Retrieves data and returns as JSON
 *
*/
class GetData {
    static async getAdmin(id) {
        let $DATA = await CommandsSQL_1.SQLDATA.getAdminSQL(id);
        if ($DATA == "")
            return null;
        else
            return JSON.parse($DATA);
    }
    static async getAdminByID(id) {
        let $DATA = await CommandsSQL_1.SQLDATA.getAdminSQLbyID(id);
        if ($DATA == "")
            return null;
        else
            return JSON.parse($DATA);
    }
    static async getAskedQuestion(question_id, channel_id) {
        let $DATA = await CommandsSQL_1.SQLDATA.getAskedQuestionSQL(question_id, channel_id);
        return $DATA; // hopefully this doesnt cause issues
    }
    static async getAskedQuestionByAskID(ask_id) {
        let $DATA = await CommandsSQL_1.SQLDATA.getAskedQuestionByAskIDSQL(ask_id);
        return $DATA;
    }
    static async getLatestAskedQuestion(channel_id) {
        let $DATA = await CommandsSQL_1.SQLDATA.getLatestAskedQuestionSQL(channel_id);
        return $DATA; // hopefully this doesnt cause issues
    }
    static async getProposal(id) {
        let $DATA = await CommandsSQL_1.SQLDATA.getProposalSQL(id);
        if ($DATA == "")
            return null;
        else
            return JSON.parse($DATA);
    }
    static async getProposalByQuestion(question) {
        let $DATA = await CommandsSQL_1.SQLDATA.getProposalByQuestionSQL(question);
        if ($DATA == "")
            return null;
        else
            return JSON.parse($DATA);
    }
    static async getProposals() {
        let $DATA = await CommandsSQL_1.SQLDATA.getProposalsSQL();
        return $DATA; //idk this kinda seems like sus casting
    }
    static async getQuestion(id) {
        let $DATA = await CommandsSQL_1.SQLDATA.getQuestionSQL(id);
        if ($DATA == "")
            return null;
        else
            return JSON.parse($DATA);
    }
    static async getAllQuestions() {
        let $DATA = await CommandsSQL_1.SQLDATA.getAllQuestionsSQL();
        return $DATA;
    }
    static async getUnusedQuestions() {
        let $DATA = await CommandsSQL_1.SQLDATA.getUnusedQuestionsSQL();
        return $DATA;
    }
    static async getUsedQuestions() {
        let $DATA = await CommandsSQL_1.SQLDATA.getUsedQuestionsSQL();
        return $DATA;
    }
    static async getQuestionChannel(id) {
        let $DATA = await CommandsSQL_1.SQLDATA.getQuestionChannelsSQL(id);
        return $DATA;
    }
    static async getQuestionChannelByServer(id) {
        let $DATA = await CommandsSQL_1.SQLDATA.getQuestionChannelsByServerSQL(id);
        return $DATA;
    }
    static async getQuestionChannels() {
        let $DATA = await CommandsSQL_1.SQLDATA.getQuestionChannelsAllSQL();
        return $DATA;
    }
    static async getPlayerAnswer(user, ask_id) {
        let $DATA = await CommandsSQL_1.SQLDATA.getPlayerAnswerSQL(user, ask_id);
        return $DATA;
    }
    static async getPlayerAnswers(ask_id) {
        let $DATA = await CommandsSQL_1.SQLDATA.getPlayerAnswersSQL(ask_id);
        return $DATA;
    }
    static async getPlayer(userID) {
        let $DATA = await CommandsSQL_1.SQLDATA.getPlayerSQL(userID);
        if ($DATA == "")
            return null;
        else
            return JSON.parse($DATA);
    }
}
exports.GetData = GetData;
