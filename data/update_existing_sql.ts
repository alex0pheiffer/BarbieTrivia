// Populate database with csv questions
import * as fs from 'fs/promises';
import {con, connectSQL} from "./sql/StartSQL";


async function update_sql(): Promise<void> {
    let CSV_NAME = "sql_ansa_output.tsv";
    let CSV_DIRECTORY = "data";
    
    // connect to sql
    if (!con.connected) await connectSQL();
    
    // read in the csv
    let csv = await fs.readFile(`${CSV_DIRECTORY}/${CSV_NAME}`, 'utf-8');
    let arr = csvToJSON(csv);

    console.log(arr);
    
    let sql_statement = ""

    for (var i = 0; i < arr.length; i++) {

        console.log(`UPDATING QUESTION ID ${arr[i]["id"]}`);

        sql_statement = `UPDATE question SET \
        question="${arr[i]["question"].replaceAll('"', '""')}", \
        ans_a="${arr[i]["a"].replaceAll('"', '""')}", \
        ans_b="${arr[i]["b"].replaceAll('"', '""')}", \
        ans_c="${arr[i]["c"].replaceAll('"', '""')}", \
        ans_d="${arr[i]["d"].replaceAll('"', '""')}" \
        WHERE question_id=${arr[i]["id"]};`;
        
        con.conn.query(sql_statement, function (err: any, result: any) {
            if (err) throw err;
            console.log(result.message + " AffectedRows: " + result.affectedRows);
            return 0;
        });
        
    }

    
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

update_sql();