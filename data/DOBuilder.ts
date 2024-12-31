import { GetData } from "./sql/GetData";
import { UpdateData } from "./sql/UpdateData";
import { InsertData } from "./sql/InsertData";
import { DeleteData } from "./sql/DeleteData";
import { QuestionO } from "./data_objects/question";
import { AdminO } from "./data_objects/admin";
import { AskedQuestionO } from "./data_objects/askedQuesetion";
import { ProposalI } from "./data_interfaces/proposal";
import { ProposalO } from "./data_objects/proposal";
import { QuestionChannelO } from "./data_objects/questionChannel";
import { AdminI } from "./data_interfaces/admin";
import { AskedQuestionI } from "./data_interfaces/askedQuestion";
import { QuestionChannelI } from "./data_interfaces/questionChannel";
import { PlayerAnswerO } from "./data_objects/playerAnswer";
import { PlayerAnswerI } from "./data_interfaces/playerAnswer";
import { PlayerO } from "./data_objects/player";
import { PlayerI } from "./data_interfaces/player";

export class DO {

    /*
     *  Get Functions
     *
     * 
     */
    
    static async getAdmin(id: string): Promise<AdminO | null> {
        let admin: AdminO;
        let adminjson = await GetData.getAdmin(id);
        if (adminjson) {
            admin = new AdminO(adminjson);
            return admin;
        }
        return null;
    }

    static async getAskedQuestion(question_id: number, channel_id: string): Promise<Array<AskedQuestionO>> {
        let askedArray: Array<AskedQuestionO> = [];
        let asked: AskedQuestionO;
        let askedjson = await GetData.getAskedQuestion(question_id, channel_id);
        
        if (askedjson.length > 0) {
            for (let i=0; i < askedjson.length; i++) {
                asked = new AskedQuestionO(askedjson[i]);
                askedArray.push(asked);
            }
        }
        
        return askedArray;
    }     

    static async getAskedQuestionByAskID(ask_id: number): Promise<Array<AskedQuestionO>> {
        let askedArray: Array<AskedQuestionO> = [];
        let asked: AskedQuestionO;
        let askedjson = await GetData.getAskedQuestionByAskID(ask_id);
        
        if (askedjson.length > 0) {
            for (let i=0; i < askedjson.length; i++) {
                asked = new AskedQuestionO(askedjson[i]);
                askedArray.push(asked);
            }
        }
        
        return askedArray;
    }      

    static async getProposal(id: number): Promise<ProposalO | null> {
        let proposal: ProposalO;
        let proposaljson = await GetData.getProposal(id);
        if (proposaljson) {
            proposal = new ProposalO(proposaljson);
            return proposal;
        }
        return null;
    }

    static async getProposals(): Promise<Array<ProposalO>> {
        let proposalArray: Array<ProposalO> = [];
        let proposal: ProposalO;
        let proposaljson = await GetData.getProposals();
        
        if (proposaljson.length > 0) {
            for (let i=0; i < proposaljson.length; i++) {
                proposal = new ProposalO(proposaljson[i]);
                proposalArray.push(proposal);
            }
        }
        
        return proposalArray;
    }    

    static async getQuestion(id: number): Promise<QuestionO | null> {
        let question: QuestionO;
        let questionjson = await GetData.getQuestion(id);
        if (questionjson) {
            question = new QuestionO(questionjson);
            return question;
        }
        return null;
    }

    static async getAllQuestions(): Promise<Array<QuestionO>> {
        let questionArray: Array<QuestionO> = [];
        let question: QuestionO;
        let questionjson = await GetData.getAllQuestions();
        
        if (questionjson.length > 0) {
            for (let i=0; i < questionjson.length; i++) {
                question = new QuestionO(questionjson[i]);
                questionArray.push(question);
            }
        }
        
        return questionArray;
    }

    static async getUnusedQuestions(): Promise<Array<QuestionO>> {
        let questionArray: Array<QuestionO> = [];
        let question: QuestionO;
        let questionjson = await GetData.getUnusedQuestions();
        
        if (questionjson.length > 0) {
            for (let i=0; i < questionjson.length; i++) {
                question = new QuestionO(questionjson[i]);
                questionArray.push(question);
            }
        }
        
        return questionArray;
    }

    static async getUsedQuestions(): Promise<Array<QuestionO>> {
        let questionArray: Array<QuestionO> = [];
        let question: QuestionO;
        let questionjson = await GetData.getUsedQuestions();
        
        if (questionjson.length > 0) {
            for (let i=0; i < questionjson.length; i++) {
                question = new QuestionO(questionjson[i]);
                questionArray.push(question);
            }
        }
        
        return questionArray;
    }

    static async getQuestionChannel(channelID: string): Promise<Array<QuestionChannelO>> {
        let channelArray: Array<QuestionChannelO> = [];
        let channel: QuestionChannelO;
        let channeljson = await GetData.getQuestionChannel(channelID);
        
        if (channeljson.length > 0) {
            for (let i=0; i < channeljson.length; i++) {
                channel = new QuestionChannelO(channeljson[i]);
                channelArray.push(channel);
            }
        }
        
        return channelArray;
    }

    static async getQuestionChannelByServer(serverID: string): Promise<Array<QuestionChannelO>> {
        let channelArray: Array<QuestionChannelO> = [];
        let channel: QuestionChannelO;
        let channeljson = await GetData.getQuestionChannelByServer(serverID);
        
        if (channeljson.length > 0) {
            for (let i=0; i < channeljson.length; i++) {
                channel = new QuestionChannelO(channeljson[i]);
                channelArray.push(channel);
            }
        }
        
        return channelArray;
    }

    static async getPlayerAnswer(user: string, ask_id: number): Promise<Array<PlayerAnswerO>> {
        let answerArray: Array<PlayerAnswerO> = [];
        let answer: PlayerAnswerO;
        let answerjson = await GetData.getPlayerAnswer(user, ask_id);
        
        if (answerjson.length > 0) {
            for (let i=0; i < answerjson.length; i++) {
                answer = new PlayerAnswerO(answerjson[i]);
                answerArray.push(answer);
            }
        }
        
        return answerArray;
    }

    static async getPlayerAnswers(ask_id: number): Promise<Array<PlayerAnswerO>> {
        let answerArray: Array<PlayerAnswerO> = [];
        let answer: PlayerAnswerO;
        let answerjson = await GetData.getPlayerAnswers(ask_id);
        
        if (answerjson.length > 0) {
            for (let i=0; i < answerjson.length; i++) {
                answer = new PlayerAnswerO(answerjson[i]);
                answerArray.push(answer);
            }
        }
        
        return answerArray;
    }    

    static async getPlayer(userID: string): Promise<PlayerO | null> {
        let player: PlayerO;
        let playerjson = await GetData.getPlayer(userID);
        if (playerjson) {
            player = new PlayerO(playerjson);
            return player;
        }
        return null;
    }

    /*
     *  Update Functions
     *
     * 
     */

    static async updateProposal(proposal: ProposalO, errType: any): Promise<number> {
        return await UpdateData.updateProposal(proposal, errType);
    }

    static async updateQuestion(question: QuestionO, errType: any): Promise<number> {
        return await UpdateData.updateQuestion(question, errType);
    }

    static async updateAskedQuestion(question: AskedQuestionO, errType: any): Promise<number> {
        return await UpdateData.updateAskedQuestion(question, errType);
    }

    static async updatePlayerAnswer(answer: PlayerAnswerO, errType: any): Promise<number> {
        return await UpdateData.updatePlayerAnswer(answer, errType);
    }

    static async updatePlayer(player: PlayerO, errType: any): Promise<number> {
        return await UpdateData.updatePlayer(player, errType);
    }

    /*
     *  Insert Functions
     *
     * 
     */
        
    static async insertAdmin(admin: AdminI): Promise<number> {
        return await InsertData.insertAdmin(admin);
    }
    
    static async insertAskedQuestion(question: AskedQuestionI): Promise<number> {
        return await InsertData.insertAskedQuestion(question);
    }
    
    static async insertProposal(proposal: ProposalO): Promise<number> {
        return await InsertData.insertProposal(proposal);
    }
    
    static async insertQuestion(question: QuestionO): Promise<number> {
        return await InsertData.insertQuestion(question);
    }
    
    static async insertQuestionChannel(channel: QuestionChannelI): Promise<number> {
        return await InsertData.insertQuestionChannel(channel);
    }
    
    static async insertPlayerAnswer(answer: PlayerAnswerI): Promise<number> {
        return await InsertData.insertPlayerAnswer(answer);
    }

    static async insertPlayer(player: PlayerI): Promise<number> {
        return await InsertData.insertPlayer(player);
    }

    /*
     *  Delete Functions
     *
     * 
     */

    static async deleteAdmin(userID: string): Promise<number> {
        return await DeleteData.deleteAdmin(userID);
    }
    
    static async deleteProposal(proposalID: number): Promise<number> {
        return await DeleteData.deleteProposal(proposalID);
    }
    
    static async deleteQuestionChannel(channel: string): Promise<number> {
        return await DeleteData.deleteQuestionChannel(channel);
    }

    static async deletePlayerAnswer(answer_id: number): Promise<number> {
        return await DeleteData.deletePlayerAnswer(answer_id);
    }
    
}
