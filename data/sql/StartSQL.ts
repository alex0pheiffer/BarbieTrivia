const mysql = require('mysql');
import {BCONST} from "../../BCONST";

//////////////// Connection and Set Up ////////////////////////////////////////////////////////////////
interface ISQLConn {
    conn: any,
    connected: Boolean
}
class SQLConn implements ISQLConn {
    private _conn: any;
    private _connected: Boolean = false;
    
    public get conn() {
        return this._conn;
    }
    public get connected() {
        return this._connected;
    }
    
    public set conn(value: any) {
        this._conn = value;
    }
    public set connected(value: Boolean) {
        this._connected = value;
    }
}

export let con = new SQLConn();

// creates a connection to the SQL database
export async function connectSQL() {

    const {networkInterfaces}= require('os');
    const nets = networkInterfaces();
    var results: {[k: string]:any} = {};
    for (const name of Object.keys(nets)) {
	for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
		if (!results.hasOwnProperty(name)) {
                    results[name] = [];
		}
		results[name].push(net.address);
            }
	}
    }
    console.log(`result: ${results}`);
    console.log(`host: ${BCONST.SQL_HOST}`);
    console.log(`database: ${BCONST.SQL_DB}`);
    if (BCONST.SQL_DEBUG) {
        console.log(`username: ${BCONST.SQL_USER}`);
        console.log(`password: ${BCONST.SQL_PASS}`);
    }

    con.conn = mysql.createPool({
        connectionLimit: 10,
        host: BCONST.SQL_HOST,
        user: BCONST.SQL_USER,
        password: BCONST.SQL_PASS,
        database: BCONST.SQL_DB
    });

    con.conn.query("show tables", function na() { });
    con.conn.on('connection', function (connection: any) {
        console.log('DB Connection established');
        con.connected = true;
        connection.on('error', function (err: any) {
            console.error(new Date(), 'MySQL error', err.code);
        });
        connection.on('close', function (err: any) {
            console.error(new Date(), 'MySQL close', err);
        });

    });
}
