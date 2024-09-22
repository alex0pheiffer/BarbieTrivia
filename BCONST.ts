/*      Constants for Barbie Trivia Bot
*
*/

require('dotenv').config() // get our passwords and such

export class BCONST {
    // Bot Information
    static DISCORD_URL = "";
    static BOT_KEY = process.env["TRAIN_TOKEN"];
    static CLIENT_ID = "";
    // 0.0  : Initial
    // 1.0  : 
    static VERSION = 1.0;
    static LOGO = "";

    // Server-Specific Information for Ryan
    // SQL information
    static USE_LOCAL_SQL = !!parseInt(process.env["USE_LOCAL_SERVER"] ? process.env["USE_LOCAL_SERVER"] : "1"); // 1 or 0
    static USE_DEV = !!parseInt(process.env["IS_DEV"] ? process.env["IS_DEV"] : "1"); // 1 or 0
    static SQL_DB_REAL = process.env["SQL_DB_MD"];
    static SQL_REMOTE_USER = process.env["SQL_REMOTE_USER"];
    static SQL_REMOTE_PASS = process.env["SQL_REMOTE_PASS"];
    static SQL_REMOTE_HOST = process.env["SQL_REMOTE_HOST"];
    static SQL_LOCAL_USER = process.env["SQL_LOCAL_USER"];
    static SQL_LOCAL_PASS = process.env["SQL_LOCAL_PASS"];
    static SQL_LOCAL_HOST = process.env["SQL_LOCAL_HOST"];

    static SQL_DB = (this.USE_DEV) ? this.SQL_DB_DEV : this.SQL_DB_REAL;
    static SQL_USER = (this.USE_LOCAL_SQL) ? this.SQL_LOCAL_USER : this.SQL_REMOTE_USER;
    static SQL_PASS = (this.USE_LOCAL_SQL) ? this.SQL_LOCAL_PASS : this.SQL_REMOTE_PASS;
    static SQL_HOST = (this.USE_LOCAL_SQL) ? this.SQL_LOCAL_HOST : this.SQL_REMOTE_HOST;

    static SQL_DEBUG = false;
}
// export the class to be used by app.ts

