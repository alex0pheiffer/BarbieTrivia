// Retreiving data from SQL
import {BCONST} from "../../BCONST";
import {DBC} from "./Database_Constants";
import {con, connectSQL} from "./StartSQL";
import { DataErr } from "../../Errors";
import {AdminI} from "../data_interfaces/admin";
import { AskedQuestionI } from "../data_interfaces/askedQuestion";
import { QuestionChannelI } from "../data_interfaces/questionChannel";
import { AskedQuestionO } from "../data_objects/askedQuesetion";
import { ProposalO } from "../data_objects/proposal";
import { QuestionO } from "../data_objects/question";
import { QuestionChannelO } from "../data_objects/questionChannel";
import { PlayerAnswerO } from "../data_objects/playerAnswer";
import { PlayerAnswerI } from "../data_interfaces/playerAnswer";
// assuming a 32-bit system
const MAX_INT = Math.pow(2, 31) - 1;
const MAX_UNSIGNED_INT = Math.pow(2, 32) - 1;
const MAX_BIGINT = Math.pow(2, 63) - 1;

/*
 *  Get Data Function Calls
 *  
 *  all data returns a string
 *  calls that do not fall but have no data return ""
 *  calls that succeed and have data will return a stringified json
*/


export class SQLDATA {

    //
    //  Get Functions

    static async getAdminSQL(userid: string): Promise<string> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            if (userid.length > DBC.userID_length) {
                console.log("ERROR: USERID too long.");
                // todo make this a valid error
                return resolve("");
            }
            // determine if this column exists
            var sqlq = `SELECT * FROM admin WHERE user = '${userid}';`;
            con.conn.query(sqlq, function (err: any, result: Array<string>) {
                if (err) throw err;

                if (BCONST.SQL_DEBUG) {
                    console.log("Obtained Data: ");
                    console.log(result);
                }

                // check that a result exists
                if (result.length <= 0) {
                    resolve("");
                    return;
                }

                return resolve(JSON.stringify(result[0]));
            }); 
        });
    }

    static async getAskedQuestionSQL(question_id: number, channel_id: string): Promise<Array<JSON>> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            if (channel_id.length > DBC.channelID_length) {
                console.log("ERROR: CHANNELID too long.");
                // todo make this a valid error
                return resolve([]);
            }
            // determine if this column already exists
            var sqlq = `SELECT * FROM asked_question WHERE question_id = ${question_id} AND channel_id = '${channel_id}';`;
            con.conn.query(sqlq, function (err: any, result: Array<string>) {
                if (err) throw err;

                if (BCONST.SQL_DEBUG) {
                    console.log("Obtained Data: ");
                    console.log(result);
                }

                // check that a result exists
                if (result.length <= 0) {
                    resolve([]);
                    return;
                }

                return resolve(JSON.parse(JSON.stringify(result)));
            }); 
        });
    }

    static async getProposalSQL(proposal_id: number): Promise<string> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column exists
            var sqlq = `SELECT * FROM proposal WHERE proposal_id = ${proposal_id};`;
            con.conn.query(sqlq, function (err: any, result: Array<string>) {
                if (err) throw err;

                if (BCONST.SQL_DEBUG) {
                    console.log("Obtained Data: ");
                    console.log(result);
                }

                // check that a result exists
                if (result.length <= 0) {
                    resolve("");
                    return;
                }

                return resolve(JSON.stringify(result[0]));
            }); 
        });
    }

    static async getProposalsSQL(): Promise<Array<JSON>> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column already exists
            var sqlq = `SELECT * FROM proposal;`;
            con.conn.query(sqlq, function (err: any, result: Array<string>) {
                if (err) throw err;

                if (BCONST.SQL_DEBUG) {
                    console.log("Obtained Data: ");
                    console.log(result);
                }

                // check that a result exists
                if (result.length <= 0) {
                    resolve([]);
                    return;
                }

                return resolve(JSON.parse(JSON.stringify(result)));
            }); 
        });
    }

    static async getQuestionSQL(question_id: number): Promise<string> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column exists
            var sqlq = `SELECT * FROM question WHERE question_id = ${question_id};`;
            con.conn.query(sqlq, function (err: any, result: Array<string>) {
                if (err) throw err;

                if (BCONST.SQL_DEBUG) {
                    console.log("Obtained Data: ");
                    console.log(result);
                }

                // check that a result exists
                if (result.length <= 0) {
                    resolve("");
                    return;
                }

                return resolve(JSON.stringify(result[0]));
            }); 
        });
    }

    static async getAllQuestionsSQL(): Promise<Array<JSON>> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column already exists
            var sqlq = `SELECT * FROM question;`;
            con.conn.query(sqlq, function (err: any, result: Array<string>) {
                if (err) throw err;

                if (BCONST.SQL_DEBUG) {
                    console.log("Obtained Data: ");
                    console.log(result);
                }

                // check that a result exists
                if (result.length <= 0) {
                    resolve([]);
                    return;
                }

                return resolve(JSON.parse(JSON.stringify(result)));
            }); 
        });
    }

    static async getUnusedQuestionsSQL(): Promise<Array<JSON>> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column already exists
            var sqlq = `SELECT * FROM question WHERE shown_total < 1;`;
            con.conn.query(sqlq, function (err: any, result: Array<string>) {
                if (err) throw err;

                if (BCONST.SQL_DEBUG) {
                    console.log("Obtained Data: ");
                    console.log(result);
                }

                // check that a result exists
                if (result.length <= 0) {
                    resolve([]);
                    return;
                }

                return resolve(JSON.parse(JSON.stringify(result)));
            }); 
        });
    }

    static async getUsedQuestionsSQL(): Promise<Array<JSON>> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column already exists
            var sqlq = `SELECT * FROM question WHERE shown_total > 0;`;
            con.conn.query(sqlq, function (err: any, result: Array<string>) {
                if (err) throw err;

                if (BCONST.SQL_DEBUG) {
                    console.log("Obtained Data: ");
                    console.log(result);
                }

                // check that a result exists
                if (result.length <= 0) {
                    resolve([]);
                    return;
                }

                return resolve(JSON.parse(JSON.stringify(result)));
            }); 
        });
    }

    static async getQuestionChannelsSQL(channelID: string): Promise<Array<JSON>> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            if (channelID.length > DBC.channelID_length) {
                console.log("ERROR: CHANNELID too long.");
                // todo make this a valid error
                return resolve([]);
            }
            // determine if this column already exists
            var sqlq = `SELECT * FROM question_channel WHERE channel='${channelID}';`;
            con.conn.query(sqlq, function (err: any, result: Array<string>) {
                if (err) throw err;

                if (BCONST.SQL_DEBUG) {
                    console.log("Obtained Data: ");
                    console.log(result);
                }

                // check that a result exists
                if (result.length <= 0) {
                    resolve([]);
                    return;
                }

                return resolve(JSON.parse(JSON.stringify(result)));
            }); 
        });
    }

    static async getQuestionChannelsByServerSQL(serverID: string): Promise<Array<JSON>> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            if (serverID.length > DBC.channelID_length) {
                console.log("ERROR: SERVERID too long.");
                // todo make this a valid error
                return resolve([]);
            }
            // determine if this column already exists
            var sqlq = `SELECT * FROM question_channel WHERE server='${serverID}';`;
            con.conn.query(sqlq, function (err: any, result: Array<string>) {
                if (err) throw err;

                if (BCONST.SQL_DEBUG) {
                    console.log("Obtained Data: ");
                    console.log(result);
                }

                // check that a result exists
                if (result.length <= 0) {
                    resolve([]);
                    return;
                }

                return resolve(JSON.parse(JSON.stringify(result)));
            }); 
        });
    }

    static async getPlayerAnswerSQL(user: String, ask_id: number): Promise<Array<JSON>> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            if (user.length > DBC.userID_length) {
                console.log("ERROR: USERID too long.");
                // todo make this a valid error
                return resolve([]);
            }
            // determine if this column already exists
            var sqlq = `SELECT * FROM player_answer WHERE user='${user}' and ask_id=${ask_id};`;
            con.conn.query(sqlq, function (err: any, result: Array<string>) {
                if (err) throw err;

                if (BCONST.SQL_DEBUG) {
                    console.log("Obtained Data: ");
                    console.log(result);
                }

                // check that a result exists
                if (result.length <= 0) {
                    resolve([]);
                    return;
                }

                return resolve(JSON.parse(JSON.stringify(result)));
            }); 
        });
    }

    //
    //  Update Functions
    
    // general update table function for all upadate functions
    private static async updateTable(sql_q: string): Promise<number> {
        return new Promise((resolve, reject) => {
            con.conn.query(sql_q, function (err: any, result: any) {
                if (err) throw err;
                
                if (BCONST.SQL_DEBUG) {
                    console.log(result.message + " AffectedRows: " + result.affectedRows);
                }
                return resolve(0);
            });
        });
    }
    
    static async updateProposal(proposal: ProposalO, errType: any): Promise<number> {
        if (!proposal.isChanges()) return 0;
        
        await checkConnection();
        return new Promise(async (resolve, reject) => {
            
            let value: any;
            let err: number;

            value = proposal.getProposalID();
            err = checkIntNotNull(value, DataErr.IDDoesNotExist, "proposal_id");
            if (err) return resolve(err);
            
            let sql_changes = "";
            let sql_q = "UPDATE proposal SET";
            
            proposal.getChanges().forEach((p) => {
                switch (p) {
                    case "question":
                        value = proposal.getQuestion();
                        err = checkString(value, DBC.question_length, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "ans_a":
                    case "ans_b":
                    case "ans_c":
                    case "ans_d":
                        value = proposal.getAnswer(p);
                        err = checkString(value, DBC.answer_length, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "d_always_last":
                        value = proposal.getDAlwaysLast();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "fun_fact":
                        value = proposal.getFunFact();
                        err = checkString(value, DBC.funfact_length, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "correct":
                        value = proposal.getCorrect();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "date":
                        value = proposal.getDate();
                        err = checkBigInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "submitter":
                        value = proposal.getSubmitter();
                        err = checkString(value, DBC.userID_length, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "image":
                        value = proposal.getImage();
                        err = checkString(value, DBC.image_length, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    default:
                        console.log("Error: the property "+p+" is not supported by updateProposal.");
                        break;
                }
            });

            if (sql_changes != "") {
                // remove the extra comma
                sql_changes = sql_changes.slice(0, sql_changes.length - 1);
                sql_q  += sql_changes;
                sql_q += ` WHERE proposal_id = '${proposal.getProposalID()}';`;
        
                let result = await this.updateTable(sql_q);
                resolve(result);
            }
        });
    }  

    static async updateQuestion(question: QuestionO, errType: any): Promise<number> {
        if (!question.isChanges()) return 0;
        
        await checkConnection();
        return new Promise(async (resolve, reject) => {
            
            let value: any;
            let err: number;

            value = question.getQuestionID();
            err = checkIntNotNull(value, DataErr.IDDoesNotExist, "question_id");
            if (err) return resolve(err);
            
            let sql_changes = "";
            let sql_q = "UPDATE question SET";
            
            question.getChanges().forEach((p) => {
                switch (p) {
                    case "question":
                        value = question.getQuestion();
                        err = checkString(value, DBC.question_length, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "ans_a":
                    case "ans_b":
                    case "ans_c":
                    case "ans_d":
                        value = question.getAnswer(p);
                        err = checkString(value, DBC.answer_length, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "d_always_last":
                        value = question.getDAlwaysLast();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "fun_fact":
                        value = question.getFunFact();
                        err = checkString(value, DBC.funfact_length, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "correct":
                        value = question.getCorrect();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "date":
                        value = question.getDate();
                        err = checkBigInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "submitter":
                        value = question.getSubmitter();
                        err = checkString(value, DBC.userID_length, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "image":
                        value = question.getImage();
                        err = checkString(value, DBC.image_length, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "response_total":
                        value = question.getResponseTotal();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "response_correct":
                        value = question.getResponseCorrect();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "shown_total":
                        value = question.getShownTotal();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    default:
                        console.log("Error: the property "+p+" is not supported by updateQuestion.");
                        break;
                }
            });

            if (sql_changes != "") {
                // remove the extra comma
                sql_changes = sql_changes.slice(0, sql_changes.length - 1);
                sql_q  += sql_changes;
                sql_q += ` WHERE question_id = '${question.getQuestionID()}';`;
        
                let result = await this.updateTable(sql_q);
                resolve(result);
            }
        });
    }  

    static async updateAskedQuestion(question: AskedQuestionO, errType: any): Promise<number> {
        if (!question.isChanges()) return 0;
        
        await checkConnection();
        return new Promise(async (resolve, reject) => {
            
            let value: any;
            let err: number;

            value = question.getAskID();
            err = checkIntNotNull(value, DataErr.IDDoesNotExist, "ask_id");
            if (err) return resolve(err);
            
            let sql_changes = "";
            let sql_q = "UPDATE asked_question SET";
            
            question.getChanges().forEach((p) => {
                switch (p) {
                    case "response_total":
                        value = question.getResponseTotal();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "response_correct":
                        value = question.getResponseCorrect();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "active":
                        value = question.getActive();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                    default:
                        console.log("Error: the property "+p+" is not supported by updateAskedQuestion.");
                        break;
                }
            });

            if (sql_changes != "") {
                // remove the extra comma
                sql_changes = sql_changes.slice(0, sql_changes.length - 1);
                sql_q  += sql_changes;
                sql_q += ` WHERE ask_id = '${question.getAskID()}';`;
        
                let result = await this.updateTable(sql_q);
                resolve(result);
            }
        });
    }  

    static async updatePlayerAnswer(answer: PlayerAnswerO, errType: any): Promise<number> {
        if (!answer.isChanges()) return 0;
        
        await checkConnection();
        return new Promise(async (resolve, reject) => {
            
            let value: any;
            let err: number;

            value = answer.getAnswerID();
            err = checkIntNotNull(value, DataErr.IDDoesNotExist, "answer_id");
            if (err) return resolve(err);
            
            let sql_changes = "";
            let sql_q = "UPDATE player_answer SET";
            
            answer.getChanges().forEach((p: any) => {
                switch (p) {
                    case "ask_id":
                        value = answer.getAskID();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "response":
                        value = answer.getResponse();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "submitted":
                        value = answer.getSubmtitted();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err) return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    default:
                        console.log("Error: the property "+p+" is not supported by updatePlayerAnswer.");
                        break;
                }
            });

            if (sql_changes != "") {
                // remove the extra comma
                sql_changes = sql_changes.slice(0, sql_changes.length - 1);
                sql_q  += sql_changes;
                sql_q += ` WHERE answer_id = '${answer.getAnswerID()}';`;
        
                let result = await this.updateTable(sql_q);
                resolve(result);
            }
        });
    }  

    //
    //  Insert Functions
    static async insertProposal(proposal: ProposalO): Promise<number> {
        await checkConnection();
        return new Promise((resolve, reject) => {

            let value: any;
            let err: number;

            value = proposal.getQuestion();
            err = checkString(value, DBC.question_length, DataErr.InvalidInputToSQL, "proposal");
            if (err) return resolve(err);
            value = proposal.getImage();
            err = checkString(value, DBC.image_length, DataErr.InvalidInputToSQL, "image");
            if (err) return resolve(err);
            value = proposal.getAnswer("ans_a");
            err = checkString(value, DBC.answer_length, DataErr.InvalidInputToSQL, "ans_a");
            if (err) return resolve(err);
            value = proposal.getAnswer("ans_b");
            err = checkString(value, DBC.answer_length, DataErr.InvalidInputToSQL, "ans_b");
            if (err) return resolve(err);
            value = proposal.getAnswer("ans_c");
            err = checkString(value, DBC.answer_length, DataErr.InvalidInputToSQL, "ans_c");
            if (err) return resolve(err);
            value = proposal.getAnswer("ans_d");
            err = checkString(value, DBC.answer_length, DataErr.InvalidInputToSQL, "ans_d");
            if (err) return resolve(err);   
            value = proposal.getDAlwaysLast();
            err = checkInt(value, DataErr.InvalidInputToSQL, "d_always_last");
            if (err) return resolve(err);
            value = proposal.getFunFact();
            err = checkString(value, DBC.funfact_length, DataErr.InvalidInputToSQL, "fun_fact");
            if (err) return resolve(err);   
            value = proposal.getCorrect();
            err = checkInt(value, DataErr.InvalidInputToSQL, "correct");
            if (err) return resolve(err);   
            value = proposal.getDate();
            err = checkBigInt(value, DataErr.InvalidInputToSQL, "date");
            if (err) return resolve(err);   
            value = proposal.getSubmitter();
            err = checkString(value, DBC.userID_length, DataErr.InvalidInputToSQL, "submitter");
            if (err) return resolve(err); 

            var sql_columns = `(question, \
            image, \
            ans_a, \
            ans_b, \
            ans_c, \
            ans_d, \
            d_always_last, \
            fun_fact, \
            correct, \
            date, \
            submitter)`;

            var sql_values = `('${proposal.getQuestion()}', \
            '${proposal.getImage()}',\
            '${proposal.getAnswer("ans_a")}',\
            '${proposal.getAnswer("ans_b")}',\
            '${proposal.getAnswer("ans_c")}',\
            '${proposal.getAnswer("ans_d")}',\
            ${proposal.getDAlwaysLast()},\
            '${proposal.getFunFact()}',\
            ${proposal.getCorrect()},\
            ${proposal.getDate()},\
            '${proposal.getSubmitter()}')`;

            var sqlq = `INSERT INTO proposal ${sql_columns} VALUES ${sql_values};`;
            con.conn.query(sqlq, function (err: any, result: any) {
                if (err && err.errno == 1062) {
                    return resolve(DataErr.IDAlreadyExists);
                }
                else if (err) {
                    throw err;
                }

                if (BCONST.SQL_DEBUG) {
                    console.log(`1 recored inserted: ${result.insertId}`);                    
                }
                return resolve(0);
            }); 
        });
    }

    static async insertQuestion(question: QuestionO): Promise<number> {
        await checkConnection();
        return new Promise((resolve, reject) => {

            let value: any;
            let err: number;

            value = question.getQuestion();
            err = checkString(value, DBC.question_length, DataErr.InvalidInputToSQL, "question");
            if (err) return resolve(err);
            value = question.getImage();
            err = checkString(value, DBC.image_length, DataErr.InvalidInputToSQL, "image");
            if (err) return resolve(err);
            value = question.getAnswer("ans_a");
            err = checkString(value, DBC.answer_length, DataErr.InvalidInputToSQL, "ans_a");
            if (err) return resolve(err);
            value = question.getAnswer("ans_b");
            err = checkString(value, DBC.answer_length, DataErr.InvalidInputToSQL, "ans_b");
            if (err) return resolve(err);
            value = question.getAnswer("ans_c");
            err = checkString(value, DBC.answer_length, DataErr.InvalidInputToSQL, "ans_c");
            if (err) return resolve(err);
            value = question.getAnswer("ans_d");
            err = checkString(value, DBC.answer_length, DataErr.InvalidInputToSQL, "ans_d");
            if (err) return resolve(err);   
            value = question.getDAlwaysLast();
            err = checkInt(value, DataErr.InvalidInputToSQL, "d_always_last");
            if (err) return resolve(err);
            value = question.getFunFact();
            err = checkString(value, DBC.funfact_length, DataErr.InvalidInputToSQL, "fun_fact");
            if (err) return resolve(err);   
            value = question.getCorrect();
            err = checkInt(value, DataErr.InvalidInputToSQL, "correct");
            if (err) return resolve(err);   
            value = question.getDate();
            err = checkBigInt(value, DataErr.InvalidInputToSQL, "date");
            if (err) return resolve(err);   
            value = question.getSubmitter();
            err = checkString(value, DBC.userID_length, DataErr.InvalidInputToSQL, "submitter");
            if (err) return resolve(err); 
            value = question.getResponseTotal();
            err = checkInt(value, DataErr.InvalidInputToSQL, "response_total");
            if (err) return resolve(err);   
            value = question.getResponseCorrect();
            err = checkInt(value, DataErr.InvalidInputToSQL, "response_correct");
            if (err) return resolve(err);   
            value = question.getShownTotal();
            err = checkInt(value, DataErr.InvalidInputToSQL, "shown_total");
            if (err) return resolve(err);   

            var sql_columns = `(question, \
            image, \
            ans_a, \
            ans_b, \
            ans_c, \
            ans_d, \
            d_always_last, \
            fun_fact, \
            correct, \
            date, \
            submitter, \
            response_total, \
            response_correct, \
            shown_total)`;

            var sql_values = `('${question.getQuestion()}', \
            '${question.getImage()}',\
            '${question.getAnswer("ans_a")}',\
            '${question.getAnswer("ans_b")}',\
            '${question.getAnswer("ans_c")}',\
            '${question.getAnswer("ans_d")}',\
            ${question.getDAlwaysLast()},\
            '${question.getFunFact()}',\
            ${question.getCorrect()},\
            ${question.getDate()},\
            '${question.getSubmitter()}',\
            ${question.getResponseTotal()},\
            ${question.getResponseCorrect()},\
            ${question.getShownTotal()})`;

            var sqlq = `INSERT INTO question ${sql_columns} VALUES ${sql_values};`;
            con.conn.query(sqlq, function (err: any, result: any) {
                if (err && err.errno == 1062) {
                    return resolve(DataErr.IDAlreadyExists);
                }
                else if (err) {
                    throw err;
                }

                if (BCONST.SQL_DEBUG) {
                    console.log(`1 recored inserted: ${result.insertId}`);                    
                }
                return resolve(0);
            }); 
        });
    }

    static async insertAdmin(admin: AdminI): Promise<number> {
        await checkConnection();
        return new Promise((resolve, reject) => {

            let value: any;
            let err: number;

            value = admin.user;
            err = checkString(value, DBC.userID_length, DataErr.InvalidInputToSQL, "admin");
            if (err) return resolve(err);
            value = admin.granter;
            err = checkString(value, DBC.userID_length, DataErr.InvalidInputToSQL, "granter");
            if (err) return resolve(err);
            
            var sql_columns = `(user, \
            granter)`;

            var sql_values = `('${admin.user}', \
            '${admin.granter}')`;

            var sqlq = `INSERT INTO admin ${sql_columns} VALUES ${sql_values};`;
            con.conn.query(sqlq, function (err: any, result: any) {
                if (err && err.errno == 1062) {
                    return resolve(DataErr.IDAlreadyExists);
                }
                else if (err) {
                    throw err;
                }

                if (BCONST.SQL_DEBUG) {
                    console.log(`1 recored inserted: ${result.insertId}`);                    
                }
                return resolve(0);
            }); 
        });
    }

    static async insertAskedQuestion(question: AskedQuestionI): Promise<number> {
        await checkConnection();
        return new Promise((resolve, reject) => {

            let value: any;
            let err: number;

            value = question.question_id;
            err = checkInt(value, DataErr.InvalidInputToSQL, "question_id");
            if (err) return resolve(err);
            value = question.date;
            err = checkBigInt(value, DataErr.InvalidInputToSQL, "date");
            if (err) return resolve(err);
            value = question.response_total;
            err = checkInt(value, DataErr.InvalidInputToSQL, "response_total");
            if (err) return resolve(err);
            value = question.response_correct;
            err = checkInt(value, DataErr.InvalidInputToSQL, "response_correct");
            if (err) return resolve(err);
            value = question.channel_id;
            err = checkString(value, DBC.channelID_length, DataErr.InvalidInputToSQL, "channel_id");
            if (err) return resolve(err);
            value = question.active;
            err = checkInt(value, DataErr.InvalidInputToSQL, "active");
            if (err) return resolve(err);   

            var sql_columns = `(question_id, \
            date, \
            response_total, \
            response_correct, \
            channel_id, \
            active)`;

            var sql_values = `(${question.question_id}, \
            ${question.date},\
            ${question.response_total},\
            ${question.response_correct},\
            '${question.channel_id}', \
            ${question.active})`;

            var sqlq = `INSERT INTO asked_question ${sql_columns} VALUES ${sql_values};`;
            con.conn.query(sqlq, function (err: any, result: any) {
                if (err && err.errno == 1062) {
                    return resolve(DataErr.IDAlreadyExists);
                }
                else if (err) {
                    throw err;
                }

                if (BCONST.SQL_DEBUG) {
                    console.log(`1 recored inserted: ${result.insertId}`);                    
                }
                return resolve(0);
            }); 
        });
    }

    static async insertQuestionChannel(channel: QuestionChannelI): Promise<number> {
        await checkConnection();
        return new Promise((resolve, reject) => {

            let value: any;
            let err: number;

            value = channel.server;
            err = checkString(value, DBC.serverID_length, DataErr.InvalidInputToSQL, "server");
            if (err) return resolve(err);   
            value = channel.channel;
            err = checkString(value, DBC.channelID_length, DataErr.InvalidInputToSQL, "channel");
            if (err) return resolve(err);   
            value = channel.owner;
            err = checkString(value, DBC.userID_length, DataErr.InvalidInputToSQL, "user");
            if (err) return resolve(err);   
            value = channel.date;
            err = checkBigInt(value, DataErr.InvalidInputToSQL, "date");
            if (err) return resolve(err);   
            value = channel.question;
            err = checkInt(value, DataErr.InvalidInputToSQL, "question");
            if (err) return resolve(err);
            
            var sql_columns = `(server, \
            channel, \
            owner, \
            date, \
            question)`;

            var sql_values = `('${channel.server}', \
            '${channel.channel}',\
            '${channel.owner}',\
            ${channel.date},\
            ${channel.question})`;

            var sqlq = `INSERT INTO question_channel ${sql_columns} VALUES ${sql_values};`;
            con.conn.query(sqlq, function (err: any, result: any) {
                if (err && err.errno == 1062) {
                    return resolve(DataErr.IDAlreadyExists);
                }
                else if (err) {
                    throw err;
                }

                if (BCONST.SQL_DEBUG) {
                    console.log(`1 recored inserted: ${result.insertId}`);                    
                }
                return resolve(0);
            }); 
        });
    }

    static async insertPlayerAnswer(answer: PlayerAnswerI): Promise<number> {
        await checkConnection();
        return new Promise((resolve, reject) => {

            let value: any;
            let err: number;

            value = answer.user;
            err = checkString(value, DBC.userID_length, DataErr.InvalidInputToSQL, "user");
            if (err) return resolve(err);   
            value = answer.ask_id;
            err = checkInt(value, DataErr.InvalidInputToSQL, "ask_id");
            if (err) return resolve(err);   
            value = answer.response;
            err = checkInt(value, DataErr.InvalidInputToSQL, "response");
            if (err) return resolve(err);   
            value = answer.submitted;
            err = checkInt(value, DataErr.InvalidInputToSQL, "submitted");
            if (err) return resolve(err);   
            
            var sql_columns = `(user, \
            ask_id, \
            response, \
            submitted)`;

            var sql_values = `('${answer.user}', \
            ${answer.ask_id},\
            ${answer.response},\
            ${answer.submitted})`;

            var sqlq = `INSERT INTO player_answer ${sql_columns} VALUES ${sql_values};`;
            con.conn.query(sqlq, function (err: any, result: any) {
                if (err && err.errno == 1062) {
                    return resolve(DataErr.IDAlreadyExists);
                }
                else if (err) {
                    throw err;
                }

                if (BCONST.SQL_DEBUG) {
                    console.log(`1 recored inserted: ${result.insertId}`);                    
                }
                return resolve(0);
            }); 
        });
    }

    //
    //  Delete Functions

    static async deleteAdmin(userID: string): Promise<number> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            if (userID.length > DBC.userID_length) {
                console.log("ERROR: USERID too long.");
                return resolve(DataErr.InvalidInputToSQL);
            }

            let sqlq = `DELETE FROM admin WHERE user='${userID}';`;
            con.conn.query(sqlq, function (err: any, result: any) {
                if (err && err.errno == 1062) {
                    return resolve(DataErr.IDDoesNotExist);
                }
                else if (err) {
                    throw err;
                }

                if (BCONST.SQL_DEBUG) {
                    console.log(`1 recored deleted.`);                    
                }
                return resolve(0);
            }); 
        });
    }

    static async deleteProposal(proposal: number): Promise<number> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            let sqlq = `DELETE FROM proposal WHERE proposal_id=${proposal};`;
            con.conn.query(sqlq, function (err: any, result: any) {
                if (err && err.errno == 1062) {
                    return resolve(DataErr.IDDoesNotExist);
                }
                else if (err) {
                    throw err;
                }

                if (BCONST.SQL_DEBUG) {
                    console.log(`1 recored deleted.`);                    
                }
                return resolve(0);
            }); 
        });
    }

    static async deleteQuestionChannel(channel: string): Promise<number> {
        await checkConnection();
        return new Promise((resolve, reject) => {
            let sqlq = `DELETE FROM question_channel WHERE channel=${channel};`;
            con.conn.query(sqlq, function (err: any, result: any) {
                if (err && err.errno == 1062) {
                    return resolve(DataErr.IDDoesNotExist);
                }
                else if (err) {
                    throw err;
                }

                if (BCONST.SQL_DEBUG) {
                    console.log(`1 recored deleted.`);                    
                }
                return resolve(0);
            }); 
        });
    }

}

async function checkConnection() {
    if (!con.connected) await connectSQL();
}

function checkInt(value: number, err: number, fieldName: string): number {
    if (value < -1 || value > MAX_INT) {
        console.log(`ERROR: ${fieldName} is outside the integer bounds [${value}].`);
        return err;
    }
    return 0;
}

function checkUnsignedInt(value: number, err: number, fieldName: string): number {
    if (value < 0 || value > MAX_UNSIGNED_INT) {
        console.log(`ERROR: ${fieldName} is too large [${value}].`);
        return err;
    }
    return 0;
}

function checkBigInt(value: number, err: number, fieldName: string): number {
    if (value > MAX_BIGINT) {
        console.log(`ERROR: ${fieldName} is too large [${value}].`);
        return err;
    }
    return 0;
}

function checkString(value: string, maxLen: number, err: number, fieldName: string): number {
    if (value.length > maxLen) {
        console.log(`ERROR: ${fieldName} is invalid length [${value}].`);
        return err;
    }
    return 0;
}

function checkIntNotNull(value: number | null, err: number, fieldName: string): number {
    if (value === null) {
        console.log(`ERROR: ${fieldName} is null.`);
        return err;
    }
    return 0;
}