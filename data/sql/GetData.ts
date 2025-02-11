// Retrieve data from the SQL database
import {SQLDATA} from "./CommandsSQL";
import {AdminI} from "../data_interfaces/admin";
import { AskedQuestionI } from "../data_interfaces/askedQuestion";
import { ProposalI } from "../data_interfaces/proposal";
import { QuestionI } from "../data_interfaces/question";
import { QuestionChannelI } from "../data_interfaces/questionChannel";
import { PlayerAnswerI } from "../data_interfaces/playerAnswer";
import { PlayerI } from "../data_interfaces/player";

/* 
 * Retrieves data and returns as JSON
 *
*/
export class GetData {
    
    static async getAdmin(id: string): Promise<AdminI | null> {
        let $DATA = await SQLDATA.getAdminSQL(id);
        if ($DATA == "") return null;
        else return JSON.parse($DATA) as AdminI;
    }

    static async getAdminByID(id: number): Promise<AdminI | null> {
        let $DATA = await SQLDATA.getAdminSQLbyID(id);
        if ($DATA == "") return null;
        else return JSON.parse($DATA) as AdminI;
    }

    static async getAskedQuestion(question_id: number, channel_id: string): Promise<Array<AskedQuestionI>> {
        let $DATA = await SQLDATA.getAskedQuestionSQL(question_id, channel_id);
        return $DATA as unknown as Array<AskedQuestionI>; // hopefully this doesnt cause issues
    }

    static async getAskedQuestionByAskID(ask_id: number): Promise<Array<AskedQuestionI>> {
        let $DATA = await SQLDATA.getAskedQuestionByAskIDSQL(ask_id);
        return $DATA as unknown as Array<AskedQuestionI>;
    }

    static async getLatestAskedQuestion(channel_id: string): Promise<Array<AskedQuestionI>> {
        let $DATA = await SQLDATA.getLatestAskedQuestionSQL(channel_id);
        return $DATA as unknown as Array<AskedQuestionI>; // hopefully this doesnt cause issues
    }
    
    static async getProposal(id: number): Promise<ProposalI | null> {
        let $DATA = await SQLDATA.getProposalSQL(id);
        if ($DATA == "") return null;
        else return JSON.parse($DATA) as ProposalI;
    }
    
    static async getProposalByQuestion(question: string): Promise<ProposalI | null> {
        let $DATA = await SQLDATA.getProposalByQuestionSQL(question);
        if ($DATA == "") return null;
        else return JSON.parse($DATA) as ProposalI;
    }

    static async getProposals(): Promise<Array<ProposalI>> {
        let $DATA = await SQLDATA.getProposalsSQL();
        return $DATA as unknown as Array<ProposalI>; //idk this kinda seems like sus casting
    }
    
    static async getQuestion(id: number): Promise<QuestionI | null> {
        let $DATA = await SQLDATA.getQuestionSQL(id);
        if ($DATA == "") return null;
        else return JSON.parse($DATA) as QuestionI;
    }

    static async getAllQuestions(): Promise<Array<QuestionI>> {
        let $DATA = await SQLDATA.getAllQuestionsSQL();
        return $DATA as unknown as Array<QuestionI>;
    }
    
    static async getUnusedQuestions(): Promise<Array<QuestionI>> {
        let $DATA = await SQLDATA.getUnusedQuestionsSQL();
        return $DATA as unknown as Array<QuestionI>;
    }
    
    static async getUsedQuestions(): Promise<Array<QuestionI>> {
        let $DATA = await SQLDATA.getUsedQuestionsSQL();
        return $DATA as unknown as Array<QuestionI>;
    }

    static async getQuestionChannel(id: string): Promise<Array<QuestionChannelI>> {
        let $DATA = await SQLDATA.getQuestionChannelsSQL(id);
        return $DATA as unknown as Array<QuestionChannelI>;
    }
    
    static async getQuestionChannelByServer(id: string): Promise<Array<QuestionChannelI>> {
        let $DATA = await SQLDATA.getQuestionChannelsByServerSQL(id);
        return $DATA as unknown as Array<QuestionChannelI>;
    }

    static async getQuestionChannels(): Promise<Array<QuestionChannelI>> {
        let $DATA = await SQLDATA.getQuestionChannelsAllSQL();
        return $DATA as unknown as Array<QuestionChannelI>;
    }

    static async getPlayerAnswer(user: string, ask_id: number): Promise<Array<PlayerAnswerI>> {
        let $DATA = await SQLDATA.getPlayerAnswerSQL(user, ask_id);
        return $DATA as unknown as Array<PlayerAnswerI>;
    }

    static async getPlayerAnswers(ask_id: number): Promise<Array<PlayerAnswerI>> {
        let $DATA = await SQLDATA.getPlayerAnswersSQL(ask_id);
        return $DATA as unknown as Array<PlayerAnswerI>;
    }

    static async getPlayer(userID: string): Promise<PlayerI | null> {
        let $DATA = await SQLDATA.getPlayerSQL(userID);
        if ($DATA == "") return null;
        else return JSON.parse($DATA) as PlayerI;
    }
}