"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSQL = exports.con = void 0;
const mysql = require('mysql');
const BCONST_1 = require("../../BCONST");
class SQLConn {
    _conn;
    _connected = false;
    get conn() {
        return this._conn;
    }
    get connected() {
        return this._connected;
    }
    set conn(value) {
        this._conn = value;
    }
    set connected(value) {
        this._connected = value;
    }
}
exports.con = new SQLConn();
// creates a connection to the SQL database
async function connectSQL() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    var results = {};
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
            if (net.family === familyV4Value && !net.internal) {
                if (!results.hasOwnProperty(name)) {
                    results[name] = [];
                }
                results[name].push(net.address);
                console.log(net.address);
            }
        }
    }
    console.log(results);
    if (BCONST_1.BCONST.SQL_DEBUG) {
        console.log(`username: ${BCONST_1.BCONST.SQL_USER}`);
        console.log(`password: ${BCONST_1.BCONST.SQL_PASS}`);
    }
    exports.con.conn = mysql.createPool({
        connectionLimit: 10,
        host: BCONST_1.BCONST.SQL_HOST,
        user: BCONST_1.BCONST.SQL_USER,
        password: BCONST_1.BCONST.SQL_PASS,
        database: BCONST_1.BCONST.SQL_DB
    });
    exports.con.conn.query("show tables", function na() { });
    exports.con.conn.on('connection', function (connection) {
        console.log('DB Connection established');
        exports.con.connected = true;
        connection.on('error', function (err) {
            console.error(new Date(), 'MySQL error', err.code);
        });
        connection.on('close', function (err) {
            console.error(new Date(), 'MySQL close', err);
        });
    });
}
exports.connectSQL = connectSQL;
