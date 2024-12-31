// Retrieve data from the SQL database
import { AdminI } from "../data_interfaces/admin";
import { AskedQuestionI } from "../data_interfaces/askedQuestion";
import { PlayerAnswerI } from "../data_interfaces/playerAnswer";
import { QuestionChannelI } from "../data_interfaces/questionChannel";
import { ProposalO } from "../data_objects/proposal";
import { QuestionO } from "../data_objects/question";
import {SQLDATA} from "./CommandsSQL";
/* 
 * Inserts data from JSON
 *
*/
export class InsertData {
    
    static async insertProposal(proposal: ProposalO): Promise<number> {
        let result = await SQLDATA.insertProposal(proposal);
        return result;
    }

    static async insertQuestion(question: QuestionO): Promise<number> {
        let result = await SQLDATA.insertQuestion(question);
        return result;
    }

    static async insertAdmin(admin: AdminI): Promise<number> {
        let result = await SQLDATA.insertAdmin(admin);
        return result;
    }

    static async insertAskedQuestion(question: AskedQuestionI): Promise<number> {
        let result = await SQLDATA.insertAskedQuestion(question);
        return result;
    }

    static async insertQuestionChannel(channel: QuestionChannelI): Promise<number> {
        let result = await SQLDATA.insertQuestionChannel(channel);
        return result;
    }        
    
    static async insertPlayerAnswer(answer: PlayerAnswerI ): Promise<number> {
        let result = await SQLDATA.insertPlayerAnswer(answer);
        return result;
    }        

}