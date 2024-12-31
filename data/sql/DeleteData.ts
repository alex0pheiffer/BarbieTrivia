// Retrieve data from the SQL database
import {SQLDATA} from "./CommandsSQL";

/* 
 * Deletes data from key
 *
*/
export class DeleteData {
    
    static async deleteAdmin(userID: string): Promise<number> {
        let result = await SQLDATA.deleteAdmin(userID);
        return result;
    }

    static async deleteProposal(proposalID: number): Promise<number> {
        let result = await SQLDATA.deleteProposal(proposalID);
        return result;
    }

    static async deleteQuestionChannel(channel: string): Promise<number> {
        let result = await SQLDATA.deleteQuestionChannel(channel);
        return result;
    }

    static async deletePlayerAnswer(answer_id: number): Promise<number> {
        let result = await SQLDATA.deletePlayerAnswer(answer_id);
        return result;
    }

}