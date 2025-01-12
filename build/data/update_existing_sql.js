"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Populate database with csv questions
const fs = __importStar(require("fs/promises"));
const StartSQL_1 = require("./sql/StartSQL");
async function update_sql() {
    let CSV_NAME = "sql_ansa_output.tsv";
    let CSV_DIRECTORY = "data";
    // connect to sql
    if (!StartSQL_1.con.connected)
        await (0, StartSQL_1.connectSQL)();
    // read in the csv
    let csv = await fs.readFile(`${CSV_DIRECTORY}/${CSV_NAME}`, 'utf-8');
    let arr = csvToJSON(csv);
    console.log(arr);
    let sql_statement = "";
    for (var i = 0; i < arr.length; i++) {
        console.log(`UPDATING QUESTION ID ${arr[i]["id"]}`);
        sql_statement = `UPDATE question SET \
        question="${arr[i]["question"].replaceAll('"', '""')}", \
        ans_a="${arr[i]["a"].replaceAll('"', '""')}", \
        ans_b="${arr[i]["b"].replaceAll('"', '""')}", \
        ans_c="${arr[i]["c"].replaceAll('"', '""')}", \
        ans_d="${arr[i]["d"].replaceAll('"', '""')}" \
        WHERE question_id=${arr[i]["id"]};`;
        StartSQL_1.con.conn.query(sql_statement, function (err, result) {
            if (err)
                throw err;
            console.log(result.message + " AffectedRows: " + result.affectedRows);
            return 0;
        });
    }
    function csvToJSON(csv) {
        var delimiter = "\t";
        var lines = csv.split("\n");
        var result = [];
        var headers;
        headers = lines[0].split(delimiter);
        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            if (lines[i] == undefined || lines[i].trim() == "") {
                continue;
            }
            var words = lines[i].split(delimiter);
            if (words.length > headers.length) {
                console.log(words[0], words.length, headers.length);
                console.log(words);
            }
            for (var j = 0; j < words.length; j++) {
                obj[headers[j].trim()] = words[j];
            }
            result.push(obj);
        }
        return result;
    }
}
update_sql();
