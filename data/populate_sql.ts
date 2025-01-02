// Populate database with csv questions
import * as fs from 'fs/promises';
import {con, connectSQL} from "./sql/StartSQL";


async function populate_sql(): Promise<void> {
    let CSV_NAME = "characters_n_questions.tsv";
    let CSV_DIRECTORY = "data";
    let SUBMITTER_ID = "415315191547559936";
    
    const d = new Date();
    let time = d.getTime(); 
    
    // connect to sql
    if (!con.connected) await connectSQL();
    
    // read in the csv
    let csv = await fs.readFile(`${CSV_DIRECTORY}/${CSV_NAME}`, 'utf-8');
    let arr = csvToJSON(csv);
    
    // create the insert sql statement
    
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
    
    let insert_statement = `INSERT INTO question ${sql_columns} VALUES `
    
    for (var i = 0; i < arr.length; i++) {
        let answer = arr[i]["Answer"].toLowerCase()
        switch (answer) {
            case "a":
                answer = 0;
                break;
            case "b": 
                answer = 1;
                break;
            case "c":
                answer = 2;
                break;
            case "d":
                answer = 3;
        }

        insert_statement += `( \
        "${arr[i]["Question"].replaceAll('"', '""')}", \
        "${arr[i]["Image"]}", \
        "${arr[i]["A"].replaceAll('"', '""')}", \
        "${arr[i]["B"].replaceAll('"', '""')}", \
        "${arr[i]["C"].replaceAll('"', '""')}", \
        "${arr[i]["D"].replaceAll('"', '""')}", \
        ${arr[i]["D_Last"]}, \
        "${arr[i]["Extra"].replaceAll('"', '""')}", \
        ${answer}, \
        ${time}, \
        "${SUBMITTER_ID}", \
        0, \
        0, \
        0 \
        )`;
        if (i < arr.length - 1) {
            insert_statement += ", ";
        }
    }
    
    con.conn.query(insert_statement, function (err: any, result: any) {
        if (err) throw err;
        console.log(result.message + " AffectedRows: " + result.affectedRows);
        return 0;
    });
    
    
    function csvToJSON(csv: string) {
        var delimiter = "\t"
        var lines = csv.split("\n");
        var result = [];
        var headers;
        headers = lines[0].split(delimiter);
    
        for (var i = 1; i < lines.length; i++) {
            var obj: any = {};
    
            if(lines[i] == undefined || lines[i].trim() == "") {
                continue;
            }
    
            var words = lines[i].split(delimiter);
            if (words.length > headers.length) {
                console.log(words[0], words.length, headers.length);
                console.log(words);
            }
            for(var j = 0; j < words.length; j++) {
                obj[headers[j].trim()] = words[j];
            }
    
            result.push(obj);
        }
        return result;
    }
}

populate_sql();