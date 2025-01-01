"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DO = void 0;
const GetData_1 = require("./sql/GetData");
const UpdateData_1 = require("./sql/UpdateData");
const InsertData_1 = require("./sql/InsertData");
const DeleteData_1 = require("./sql/DeleteData");
const question_1 = require("./data_objects/question");
const admin_1 = require("./data_objects/admin");
const askedQuesetion_1 = require("./data_objects/askedQuesetion");
const proposal_1 = require("./data_objects/proposal");
const questionChannel_1 = require("./data_objects/questionChannel");
const playerAnswer_1 = require("./data_objects/playerAnswer");
const player_1 = require("./data_objects/player");
class DO {
    /*
     *  Get Functions
     *
     *
     */
    static async getAdmin(id) {
        let admin;
        let adminjson = await GetData_1.GetData.getAdmin(id);
        if (adminjson) {
            admin = new admin_1.AdminO(adminjson);
            return admin;
        }
        return null;
    }
    static async getAskedQuestion(question_id, channel_id) {
        let askedArray = [];
        let asked;
        let askedjson = await GetData_1.GetData.getAskedQuestion(question_id, channel_id);
        if (askedjson.length > 0) {
            for (let i = 0; i < askedjson.length; i++) {
                asked = new askedQuesetion_1.AskedQuestionO(askedjson[i]);
                askedArray.push(asked);
            }
        }
        return askedArray;
    }
    static async getAskedQuestionByAskID(ask_id) {
        let askedArray = [];
        let asked;
        let askedjson = await GetData_1.GetData.getAskedQuestionByAskID(ask_id);
        if (askedjson.length > 0) {
            for (let i = 0; i < askedjson.length; i++) {
                asked = new askedQuesetion_1.AskedQuestionO(askedjson[i]);
                askedArray.push(asked);
            }
        }
        return askedArray;
    }
    static async getLatestAskedQuestion(channel_id) {
        let askedArray = [];
        let asked;
        let askedjson = await GetData_1.GetData.getLatestAskedQuestion(channel_id);
        if (askedjson.length > 0) {
            for (let i = 0; i < askedjson.length; i++) {
                asked = new askedQuesetion_1.AskedQuestionO(askedjson[i]);
                askedArray.push(asked);
            }
        }
        return askedArray;
    }
    static async getProposal(id) {
        let proposal;
        let proposaljson = await GetData_1.GetData.getProposal(id);
        if (proposaljson) {
            proposal = new proposal_1.ProposalO(proposaljson);
            return proposal;
        }
        return null;
    }
    static async getProposalByQuestion(question) {
        let proposal;
        let proposaljson = await GetData_1.GetData.getProposalByQuestion(question);
        if (proposaljson) {
            proposal = new proposal_1.ProposalO(proposaljson);
            return proposal;
        }
        return null;
    }
    static async getProposals() {
        let proposalArray = [];
        let proposal;
        let proposaljson = await GetData_1.GetData.getProposals();
        if (proposaljson.length > 0) {
            for (let i = 0; i < proposaljson.length; i++) {
                proposal = new proposal_1.ProposalO(proposaljson[i]);
                proposalArray.push(proposal);
            }
        }
        return proposalArray;
    }
    static async getQuestion(id) {
        let question;
        let questionjson = await GetData_1.GetData.getQuestion(id);
        if (questionjson) {
            question = new question_1.QuestionO(questionjson);
            return question;
        }
        return null;
    }
    static async getAllQuestions() {
        let questionArray = [];
        let question;
        let questionjson = await GetData_1.GetData.getAllQuestions();
        if (questionjson.length > 0) {
            for (let i = 0; i < questionjson.length; i++) {
                question = new question_1.QuestionO(questionjson[i]);
                questionArray.push(question);
            }
        }
        return questionArray;
    }
    static async getUnusedQuestions() {
        let questionArray = [];
        let question;
        let questionjson = await GetData_1.GetData.getUnusedQuestions();
        if (questionjson.length > 0) {
            for (let i = 0; i < questionjson.length; i++) {
                question = new question_1.QuestionO(questionjson[i]);
                questionArray.push(question);
            }
        }
        return questionArray;
    }
    static async getUsedQuestions() {
        let questionArray = [];
        let question;
        let questionjson = await GetData_1.GetData.getUsedQuestions();
        if (questionjson.length > 0) {
            for (let i = 0; i < questionjson.length; i++) {
                question = new question_1.QuestionO(questionjson[i]);
                questionArray.push(question);
            }
        }
        return questionArray;
    }
    static async getQuestionChannel(channelID) {
        let channelArray = [];
        let channel;
        let channeljson = await GetData_1.GetData.getQuestionChannel(channelID);
        if (channeljson.length > 0) {
            for (let i = 0; i < channeljson.length; i++) {
                channel = new questionChannel_1.QuestionChannelO(channeljson[i]);
                channelArray.push(channel);
            }
        }
        return channelArray;
    }
    static async getQuestionChannelByServer(serverID) {
        let channelArray = [];
        let channel;
        let channeljson = await GetData_1.GetData.getQuestionChannelByServer(serverID);
        if (channeljson.length > 0) {
            for (let i = 0; i < channeljson.length; i++) {
                channel = new questionChannel_1.QuestionChannelO(channeljson[i]);
                channelArray.push(channel);
            }
        }
        return channelArray;
    }
    static async getQuestionChannels() {
        let channelArray = [];
        let channel;
        let channeljson = await GetData_1.GetData.getQuestionChannels();
        if (channeljson.length > 0) {
            for (let i = 0; i < channeljson.length; i++) {
                channel = new questionChannel_1.QuestionChannelO(channeljson[i]);
                channelArray.push(channel);
            }
        }
        return channelArray;
    }
    static async getPlayerAnswer(user, ask_id) {
        let answerArray = [];
        let answer;
        let answerjson = await GetData_1.GetData.getPlayerAnswer(user, ask_id);
        if (answerjson.length > 0) {
            for (let i = 0; i < answerjson.length; i++) {
                answer = new playerAnswer_1.PlayerAnswerO(answerjson[i]);
                answerArray.push(answer);
            }
        }
        return answerArray;
    }
    static async getPlayerAnswers(ask_id) {
        let answerArray = [];
        let answer;
        let answerjson = await GetData_1.GetData.getPlayerAnswers(ask_id);
        if (answerjson.length > 0) {
            for (let i = 0; i < answerjson.length; i++) {
                answer = new playerAnswer_1.PlayerAnswerO(answerjson[i]);
                answerArray.push(answer);
            }
        }
        return answerArray;
    }
    static async getPlayer(userID) {
        let player;
        let playerjson = await GetData_1.GetData.getPlayer(userID);
        if (playerjson) {
            player = new player_1.PlayerO(playerjson);
            return player;
        }
        return null;
    }
    /*
     *  Update Functions
     *
     *
     */
    static async updateProposal(proposal, errType) {
        return await UpdateData_1.UpdateData.updateProposal(proposal, errType);
    }
    static async updateQuestion(question, errType) {
        return await UpdateData_1.UpdateData.updateQuestion(question, errType);
    }
    static async updateAskedQuestion(question, errType) {
        return await UpdateData_1.UpdateData.updateAskedQuestion(question, errType);
    }
    static async updatePlayerAnswer(answer, errType) {
        return await UpdateData_1.UpdateData.updatePlayerAnswer(answer, errType);
    }
    static async updatePlayer(player, errType) {
        return await UpdateData_1.UpdateData.updatePlayer(player, errType);
    }
    /*
     *  Insert Functions
     *
     *
     */
    static async insertAdmin(admin) {
        return await InsertData_1.InsertData.insertAdmin(admin);
    }
    static async insertAskedQuestion(question) {
        return await InsertData_1.InsertData.insertAskedQuestion(question);
    }
    static async insertProposal(proposal) {
        return await InsertData_1.InsertData.insertProposal(proposal);
    }
    static async insertQuestion(question) {
        return await InsertData_1.InsertData.insertQuestion(question);
    }
    static async insertQuestionChannel(channel) {
        return await InsertData_1.InsertData.insertQuestionChannel(channel);
    }
    static async insertPlayerAnswer(answer) {
        return await InsertData_1.InsertData.insertPlayerAnswer(answer);
    }
    static async insertPlayer(player) {
        return await InsertData_1.InsertData.insertPlayer(player);
    }
    /*
     *  Delete Functions
     *
     *
     */
    static async deleteAdmin(userID) {
        return await DeleteData_1.DeleteData.deleteAdmin(userID);
    }
    static async deleteProposal(proposalID) {
        return await DeleteData_1.DeleteData.deleteProposal(proposalID);
    }
    static async deleteQuestionChannel(channel) {
        return await DeleteData_1.DeleteData.deleteQuestionChannel(channel);
    }
    static async deletePlayerAnswer(answer_id) {
        return await DeleteData_1.DeleteData.deletePlayerAnswer(answer_id);
    }
}
exports.DO = DO;
