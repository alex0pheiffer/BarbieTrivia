"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLDATA = void 0;
// Retreiving data from SQL
const BCONST_1 = require("../../BCONST");
const Database_Constants_1 = require("./Database_Constants");
const StartSQL_1 = require("./StartSQL");
const Errors_1 = require("../../Errors");
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
class SQLDATA {
    //
    //  Get Functions
    static async getAdminSQL(userid) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            if (userid.length > Database_Constants_1.DBC.userID_length) {
                console.log("ERROR: USERID too long.");
                // todo make this a valid error
                return resolve("");
            }
            // determine if this column exists
            var sqlq = `SELECT * FROM admin WHERE user = '${userid}';`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err)
                    throw err;
                if (BCONST_1.BCONST.SQL_DEBUG) {
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
    static async getAskedQuestionSQL(question_id, channel_id) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            if (channel_id.length > Database_Constants_1.DBC.channelID_length) {
                console.log("ERROR: CHANNELID too long.");
                // todo make this a valid error
                return resolve([]);
            }
            // determine if this column already exists
            var sqlq = `SELECT * FROM asked_question WHERE question_id = ${question_id} AND channel_id = '${channel_id}';`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err)
                    throw err;
                if (BCONST_1.BCONST.SQL_DEBUG) {
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
    static async getProposalSQL(proposal_id) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column exists
            var sqlq = `SELECT * FROM proposal WHERE proposal_id = ${proposal_id};`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err)
                    throw err;
                if (BCONST_1.BCONST.SQL_DEBUG) {
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
    static async getProposalsSQL() {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column already exists
            var sqlq = `SELECT * FROM proposal;`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err)
                    throw err;
                if (BCONST_1.BCONST.SQL_DEBUG) {
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
    static async getQuestionSQL(question_id) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column exists
            var sqlq = `SELECT * FROM question WHERE question_id = ${question_id};`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err)
                    throw err;
                if (BCONST_1.BCONST.SQL_DEBUG) {
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
    static async getAllQuestionsSQL() {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column already exists
            var sqlq = `SELECT * FROM question;`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err)
                    throw err;
                if (BCONST_1.BCONST.SQL_DEBUG) {
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
    static async getUnusedQuestionsSQL() {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column already exists
            var sqlq = `SELECT * FROM question WHERE shown_total < 1;`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err)
                    throw err;
                if (BCONST_1.BCONST.SQL_DEBUG) {
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
    static async getUsedQuestionsSQL() {
        await checkConnection();
        return new Promise((resolve, reject) => {
            // determine if this column already exists
            var sqlq = `SELECT * FROM question WHERE shown_total > 0;`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err)
                    throw err;
                if (BCONST_1.BCONST.SQL_DEBUG) {
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
    static async getQuestionChannelsSQL(channelID) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            if (channelID.length > Database_Constants_1.DBC.channelID_length) {
                console.log("ERROR: CHANNELID too long.");
                // todo make this a valid error
                return resolve([]);
            }
            // determine if this column already exists
            var sqlq = `SELECT * FROM question_channel WHERE channel='${channelID}';`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err)
                    throw err;
                if (BCONST_1.BCONST.SQL_DEBUG) {
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
    static async updateTable(sql_q) {
        return new Promise((resolve, reject) => {
            StartSQL_1.con.conn.query(sql_q, function (err, result) {
                if (err)
                    throw err;
                if (BCONST_1.BCONST.SQL_DEBUG) {
                    console.log(result.message + " AffectedRows: " + result.affectedRows);
                }
                return resolve(0);
            });
        });
    }
    static async updateProposal(proposal, errType) {
        if (!proposal.isChanges())
            return 0;
        await checkConnection();
        return new Promise(async (resolve, reject) => {
            let value;
            let err;
            value = proposal.getProposalID();
            err = checkIntNotNull(value, Errors_1.DataErr.IDDoesNotExist, "proposal_id");
            if (err)
                return resolve(err);
            let sql_changes = "";
            let sql_q = "UPDATE proposal SET";
            proposal.getChanges().forEach((p) => {
                switch (p) {
                    case "question":
                        value = proposal.getQuestion();
                        err = checkString(value, Database_Constants_1.DBC.question_length, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "ans_a":
                    case "ans_b":
                    case "ans_c":
                    case "ans_d":
                        value = proposal.getAnswer(p);
                        err = checkString(value, Database_Constants_1.DBC.answer_length, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "d_always_last":
                        value = proposal.getDAlwaysLast();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "fun_fact":
                        value = proposal.getFunFact();
                        err = checkString(value, Database_Constants_1.DBC.funfact_length, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "correct":
                        value = proposal.getCorrect();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "date":
                        value = proposal.getDate();
                        err = checkBigInt(value, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "submitter":
                        value = proposal.getSubmitter();
                        err = checkString(value, Database_Constants_1.DBC.userID_length, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "image":
                        value = proposal.getImage();
                        err = checkString(value, Database_Constants_1.DBC.image_length, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    default:
                        console.log("Error: the property " + p + " is not supported by updateProposal.");
                        break;
                }
            });
            if (sql_changes != "") {
                // remove the extra comma
                sql_changes = sql_changes.slice(0, sql_changes.length - 1);
                sql_q += sql_changes;
                sql_q += ` WHERE proposal_id = '${proposal.getProposalID()}';`;
                let result = await this.updateTable(sql_q);
                resolve(result);
            }
        });
    }
    static async updateQuestion(question, errType) {
        if (!question.isChanges())
            return 0;
        await checkConnection();
        return new Promise(async (resolve, reject) => {
            let value;
            let err;
            value = question.getQuestionID();
            err = checkIntNotNull(value, Errors_1.DataErr.IDDoesNotExist, "question_id");
            if (err)
                return resolve(err);
            let sql_changes = "";
            let sql_q = "UPDATE question SET";
            question.getChanges().forEach((p) => {
                switch (p) {
                    case "question":
                        value = question.getQuestion();
                        err = checkString(value, Database_Constants_1.DBC.question_length, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "ans_a":
                    case "ans_b":
                    case "ans_c":
                    case "ans_d":
                        value = question.getAnswer(p);
                        err = checkString(value, Database_Constants_1.DBC.answer_length, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "d_always_last":
                        value = question.getDAlwaysLast();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "fun_fact":
                        value = question.getFunFact();
                        err = checkString(value, Database_Constants_1.DBC.funfact_length, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "correct":
                        value = question.getCorrect();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "date":
                        value = question.getDate();
                        err = checkBigInt(value, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "submitter":
                        value = question.getSubmitter();
                        err = checkString(value, Database_Constants_1.DBC.userID_length, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "image":
                        value = question.getImage();
                        err = checkString(value, Database_Constants_1.DBC.image_length, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = '${value}',`;
                        break;
                    case "response_total":
                        value = question.getResponseTotal();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "response_correct":
                        value = question.getResponseCorrect();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "shown_total":
                        value = question.getShownTotal();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    default:
                        console.log("Error: the property " + p + " is not supported by updateQuestion.");
                        break;
                }
            });
            if (sql_changes != "") {
                // remove the extra comma
                sql_changes = sql_changes.slice(0, sql_changes.length - 1);
                sql_q += sql_changes;
                sql_q += ` WHERE question_id = '${question.getQuestionID()}';`;
                let result = await this.updateTable(sql_q);
                resolve(result);
            }
        });
    }
    static async updateAskedQuestion(question, errType) {
        if (!question.isChanges())
            return 0;
        await checkConnection();
        return new Promise(async (resolve, reject) => {
            let value;
            let err;
            value = question.getAskID();
            err = checkIntNotNull(value, Errors_1.DataErr.IDDoesNotExist, "ask_id");
            if (err)
                return resolve(err);
            let sql_changes = "";
            let sql_q = "UPDATE asked_question SET";
            question.getChanges().forEach((p) => {
                switch (p) {
                    case "response_total":
                        value = question.getResponseTotal();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    case "response_correct":
                        value = question.getResponseCorrect();
                        err = checkInt(value, errType.InvalidInputToSQL, p);
                        if (err)
                            return resolve(err);
                        sql_changes += ` ${p} = ${value},`;
                        break;
                    default:
                        console.log("Error: the property " + p + " is not supported by updateAskedQuestion.");
                        break;
                }
            });
            if (sql_changes != "") {
                // remove the extra comma
                sql_changes = sql_changes.slice(0, sql_changes.length - 1);
                sql_q += sql_changes;
                sql_q += ` WHERE ask_id = '${question.getAskID()}';`;
                let result = await this.updateTable(sql_q);
                resolve(result);
            }
        });
    }
    //
    //  Insert Functions
    static async insertProposal(proposal) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            let value;
            let err;
            value = proposal.getQuestion();
            err = checkString(value, Database_Constants_1.DBC.question_length, Errors_1.DataErr.InvalidInputToSQL, "proposal");
            if (err)
                return resolve(err);
            value = proposal.getImage();
            err = checkString(value, Database_Constants_1.DBC.image_length, Errors_1.DataErr.InvalidInputToSQL, "image");
            if (err)
                return resolve(err);
            value = proposal.getAnswer("ans_a");
            err = checkString(value, Database_Constants_1.DBC.answer_length, Errors_1.DataErr.InvalidInputToSQL, "ans_a");
            if (err)
                return resolve(err);
            value = proposal.getAnswer("ans_b");
            err = checkString(value, Database_Constants_1.DBC.answer_length, Errors_1.DataErr.InvalidInputToSQL, "ans_b");
            if (err)
                return resolve(err);
            value = proposal.getAnswer("ans_c");
            err = checkString(value, Database_Constants_1.DBC.answer_length, Errors_1.DataErr.InvalidInputToSQL, "ans_c");
            if (err)
                return resolve(err);
            value = proposal.getAnswer("ans_d");
            err = checkString(value, Database_Constants_1.DBC.answer_length, Errors_1.DataErr.InvalidInputToSQL, "ans_d");
            if (err)
                return resolve(err);
            value = proposal.getDAlwaysLast();
            err = checkInt(value, Errors_1.DataErr.InvalidInputToSQL, "d_always_last");
            if (err)
                return resolve(err);
            value = proposal.getFunFact();
            err = checkString(value, Database_Constants_1.DBC.funfact_length, Errors_1.DataErr.InvalidInputToSQL, "fun_fact");
            if (err)
                return resolve(err);
            value = proposal.getCorrect();
            err = checkInt(value, Errors_1.DataErr.InvalidInputToSQL, "correct");
            if (err)
                return resolve(err);
            value = proposal.getDate();
            err = checkBigInt(value, Errors_1.DataErr.InvalidInputToSQL, "date");
            if (err)
                return resolve(err);
            value = proposal.getSubmitter();
            err = checkString(value, Database_Constants_1.DBC.userID_length, Errors_1.DataErr.InvalidInputToSQL, "submitter");
            if (err)
                return resolve(err);
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
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err && err.errno == 1062) {
                    return resolve(Errors_1.DataErr.IDAlreadyExists);
                }
                else if (err) {
                    throw err;
                }
                if (BCONST_1.BCONST.SQL_DEBUG) {
                    console.log(`1 recored inserted: ${result.insertId}`);
                }
                return resolve(0);
            });
        });
    }
    static async insertQuestion(question) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            let value;
            let err;
            value = question.getQuestion();
            err = checkString(value, Database_Constants_1.DBC.question_length, Errors_1.DataErr.InvalidInputToSQL, "question");
            if (err)
                return resolve(err);
            value = question.getImage();
            err = checkString(value, Database_Constants_1.DBC.image_length, Errors_1.DataErr.InvalidInputToSQL, "image");
            if (err)
                return resolve(err);
            value = question.getAnswer("ans_a");
            err = checkString(value, Database_Constants_1.DBC.answer_length, Errors_1.DataErr.InvalidInputToSQL, "ans_a");
            if (err)
                return resolve(err);
            value = question.getAnswer("ans_b");
            err = checkString(value, Database_Constants_1.DBC.answer_length, Errors_1.DataErr.InvalidInputToSQL, "ans_b");
            if (err)
                return resolve(err);
            value = question.getAnswer("ans_c");
            err = checkString(value, Database_Constants_1.DBC.answer_length, Errors_1.DataErr.InvalidInputToSQL, "ans_c");
            if (err)
                return resolve(err);
            value = question.getAnswer("ans_d");
            err = checkString(value, Database_Constants_1.DBC.answer_length, Errors_1.DataErr.InvalidInputToSQL, "ans_d");
            if (err)
                return resolve(err);
            value = question.getDAlwaysLast();
            err = checkInt(value, Errors_1.DataErr.InvalidInputToSQL, "d_always_last");
            if (err)
                return resolve(err);
            value = question.getFunFact();
            err = checkString(value, Database_Constants_1.DBC.funfact_length, Errors_1.DataErr.InvalidInputToSQL, "fun_fact");
            if (err)
                return resolve(err);
            value = question.getCorrect();
            err = checkInt(value, Errors_1.DataErr.InvalidInputToSQL, "correct");
            if (err)
                return resolve(err);
            value = question.getDate();
            err = checkBigInt(value, Errors_1.DataErr.InvalidInputToSQL, "date");
            if (err)
                return resolve(err);
            value = question.getSubmitter();
            err = checkString(value, Database_Constants_1.DBC.userID_length, Errors_1.DataErr.InvalidInputToSQL, "submitter");
            if (err)
                return resolve(err);
            value = question.getResponseTotal();
            err = checkInt(value, Errors_1.DataErr.InvalidInputToSQL, "response_total");
            if (err)
                return resolve(err);
            value = question.getResponseCorrect();
            err = checkInt(value, Errors_1.DataErr.InvalidInputToSQL, "response_correct");
            if (err)
                return resolve(err);
            value = question.getShownTotal();
            err = checkInt(value, Errors_1.DataErr.InvalidInputToSQL, "shown_total");
            if (err)
                return resolve(err);
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
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err && err.errno == 1062) {
                    return resolve(Errors_1.DataErr.IDAlreadyExists);
                }
                else if (err) {
                    throw err;
                }
                if (BCONST_1.BCONST.SQL_DEBUG) {
                    console.log(`1 recored inserted: ${result.insertId}`);
                }
                return resolve(0);
            });
        });
    }
    static async insertAdmin(admin) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            let value;
            let err;
            value = admin.user;
            err = checkString(value, Database_Constants_1.DBC.userID_length, Errors_1.DataErr.InvalidInputToSQL, "admin");
            if (err)
                return resolve(err);
            value = admin.granter;
            err = checkString(value, Database_Constants_1.DBC.userID_length, Errors_1.DataErr.InvalidInputToSQL, "granter");
            if (err)
                return resolve(err);
            var sql_columns = `(user, \
            granter)`;
            var sql_values = `('${admin.user}', \
            '${admin.granter}')`;
            var sqlq = `INSERT INTO admin ${sql_columns} VALUES ${sql_values};`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err && err.errno == 1062) {
                    return resolve(Errors_1.DataErr.IDAlreadyExists);
                }
                else if (err) {
                    throw err;
                }
                if (BCONST_1.BCONST.SQL_DEBUG) {
                    console.log(`1 recored inserted: ${result.insertId}`);
                }
                return resolve(0);
            });
        });
    }
    static async insertAskedQuestion(question) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            let value;
            let err;
            value = question.question_id;
            err = checkInt(value, Errors_1.DataErr.InvalidInputToSQL, "question_id");
            if (err)
                return resolve(err);
            value = question.date;
            err = checkBigInt(value, Errors_1.DataErr.InvalidInputToSQL, "date");
            if (err)
                return resolve(err);
            value = question.response_total;
            err = checkInt(value, Errors_1.DataErr.InvalidInputToSQL, "response_total");
            if (err)
                return resolve(err);
            value = question.response_correct;
            err = checkInt(value, Errors_1.DataErr.InvalidInputToSQL, "response_correct");
            if (err)
                return resolve(err);
            value = question.channel_id;
            err = checkString(value, Database_Constants_1.DBC.channelID_length, Errors_1.DataErr.InvalidInputToSQL, "channel_id");
            if (err)
                return resolve(err);
            var sql_columns = `(question_id, \
            date, \
            response_total, \
            response_correct, \
            channel_id)`;
            var sql_values = `(${question.question_id}, \
            ${question.date},\
            ${question.response_total},\
            ${question.response_correct},\
            '${question.channel_id}')`;
            var sqlq = `INSERT INTO asked_question ${sql_columns} VALUES ${sql_values};`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err && err.errno == 1062) {
                    return resolve(Errors_1.DataErr.IDAlreadyExists);
                }
                else if (err) {
                    throw err;
                }
                if (BCONST_1.BCONST.SQL_DEBUG) {
                    console.log(`1 recored inserted: ${result.insertId}`);
                }
                return resolve(0);
            });
        });
    }
    static async insertQuestionChannel(channel) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            let value;
            let err;
            value = channel.server;
            err = checkString(value, Database_Constants_1.DBC.serverID_length, Errors_1.DataErr.InvalidInputToSQL, "server");
            if (err)
                return resolve(err);
            value = channel.channel;
            err = checkString(value, Database_Constants_1.DBC.channelID_length, Errors_1.DataErr.InvalidInputToSQL, "channel");
            if (err)
                return resolve(err);
            value = channel.owner;
            err = checkString(value, Database_Constants_1.DBC.userID_length, Errors_1.DataErr.InvalidInputToSQL, "user");
            if (err)
                return resolve(err);
            value = channel.date;
            err = checkBigInt(value, Errors_1.DataErr.InvalidInputToSQL, "date");
            if (err)
                return resolve(err);
            value = channel.question;
            err = checkInt(value, Errors_1.DataErr.InvalidInputToSQL, "question");
            if (err)
                return resolve(err);
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
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err && err.errno == 1062) {
                    return resolve(Errors_1.DataErr.IDAlreadyExists);
                }
                else if (err) {
                    throw err;
                }
                if (BCONST_1.BCONST.SQL_DEBUG) {
                    console.log(`1 recored inserted: ${result.insertId}`);
                }
                return resolve(0);
            });
        });
    }
    //
    //  Delete Functions
    static async deleteAdmin(userID) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            if (userID.length > Database_Constants_1.DBC.userID_length) {
                console.log("ERROR: USERID too long.");
                return resolve(Errors_1.DataErr.InvalidInputToSQL);
            }
            let sqlq = `DELETE FROM admin WHERE user='${userID}';`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err && err.errno == 1062) {
                    return resolve(Errors_1.DataErr.IDDoesNotExist);
                }
                else if (err) {
                    throw err;
                }
                if (BCONST_1.BCONST.SQL_DEBUG) {
                    console.log(`1 recored deleted.`);
                }
                return resolve(0);
            });
        });
    }
    static async deleteProposal(proposal) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            let sqlq = `DELETE FROM proposal WHERE proposal_id=${proposal};`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err && err.errno == 1062) {
                    return resolve(Errors_1.DataErr.IDDoesNotExist);
                }
                else if (err) {
                    throw err;
                }
                if (BCONST_1.BCONST.SQL_DEBUG) {
                    console.log(`1 recored deleted.`);
                }
                return resolve(0);
            });
        });
    }
    static async deleteQuestionChannel(channel) {
        await checkConnection();
        return new Promise((resolve, reject) => {
            let sqlq = `DELETE FROM question_channel WHERE channel=${channel};`;
            StartSQL_1.con.conn.query(sqlq, function (err, result) {
                if (err && err.errno == 1062) {
                    return resolve(Errors_1.DataErr.IDDoesNotExist);
                }
                else if (err) {
                    throw err;
                }
                if (BCONST_1.BCONST.SQL_DEBUG) {
                    console.log(`1 recored deleted.`);
                }
                return resolve(0);
            });
        });
    }
}
exports.SQLDATA = SQLDATA;
async function checkConnection() {
    if (!StartSQL_1.con.connected)
        await (0, StartSQL_1.connectSQL)();
}
function checkInt(value, err, fieldName) {
    if (value < -1 || value > MAX_INT) {
        console.log(`ERROR: ${fieldName} is outside the integer bounds [${value}].`);
        return err;
    }
    return 0;
}
function checkUnsignedInt(value, err, fieldName) {
    if (value < 0 || value > MAX_UNSIGNED_INT) {
        console.log(`ERROR: ${fieldName} is too large [${value}].`);
        return err;
    }
    return 0;
}
function checkBigInt(value, err, fieldName) {
    if (value > MAX_BIGINT) {
        console.log(`ERROR: ${fieldName} is too large [${value}].`);
        return err;
    }
    return 0;
}
function checkString(value, maxLen, err, fieldName) {
    if (value.length > maxLen) {
        console.log(`ERROR: ${fieldName} is invalid length [${value}].`);
        return err;
    }
    return 0;
}
function checkIntNotNull(value, err, fieldName) {
    if (value === null) {
        console.log(`ERROR: ${fieldName} is null.`);
        return err;
    }
    return 0;
}