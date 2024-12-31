// Retrieve data from the SQL database
import { AskedQuestionO } from "../data_objects/askedQuesetion";
import { PlayerAnswerO } from "../data_objects/playerAnswer";
import { ProposalO } from "../data_objects/proposal";
import { QuestionO } from "../data_objects/question";
import {SQLDATA} from "./CommandsSQL";

/* 
 * Updates data from JSONs
 *
*/
export class UpdateData {

    static async updateProposal(proposal: ProposalO, errType: any): Promise<number> {
        let result = await SQLDATA.updateProposal(proposal, errType);
        return result;
    }

    static async updateQuestion(question: QuestionO, errType: any): Promise<number> {
        let result = await SQLDATA.updateQuestion(question, errType);
        return result;
    }

    static async updateAskedQuestion(question: AskedQuestionO, errType: any): Promise<number> {
        let result = await SQLDATA.updateAskedQuestion(question, errType);
        return result;
    }

    static async updatePlayerAnswer(answer: PlayerAnswerO, errType: any): Promise<number> {
        let result = await SQLDATA.updatePlayerAnswer(answer, errType);
        return result;
    }
}