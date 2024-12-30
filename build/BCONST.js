"use strict";
/*      Constants for Barbie Trivia Bot
*
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.BCONST = void 0;
require('dotenv').config(); // get our passwords and such
class BCONST {
    // Bot Information
    static DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1266967306752491580";
    static BOT_KEY = process.env["TOKEN"];
    static CLIENT_ID = "1266967306752491580";
    // 0.0  : Initial
    // 1.0  : 
    static VERSION = 1.0;
    static LOGO = "https://cdn.discordapp.com/attachments/1305182222214496288/1305272685651169280/barbie-logo-2004-5.png?ex=67326d6b&is=67311beb&hm=1954ed989cba370fde695e5c05481b7136707e65734fc31f74d4a27793fa1065&";
    // Server-Specific Information for Ryan
    // SQL information
    static USE_LOCAL_SQL = !!parseInt(process.env["USE_LOCAL_SERVER"] ? process.env["USE_LOCAL_SERVER"] : "1"); // 1 or 0
    static USE_DEV = !!parseInt(process.env["IS_DEV"] ? process.env["IS_DEV"] : "1"); // 1 or 0
    static SQL_DB_REAL = process.env["SQL_DB"];
    static SQL_DB_DEV = this.SQL_DB_REAL;
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
    // UI Information
    static BTN_SUBMIT = "Submit";
    static DROPDOWN_INTERVAL = "Time Interval Selection";
    // Game Specific Information
    static QUESTION_INTERVALS = [
        { "label": "Every Hour", "description": "", "value": 0 },
        { "label": "Every 6 Hours", "description": "", "value": 1 },
        { "label": "Every 12 Hours", "description": "", "value": 2 },
        { "label": "Every Day", "description": "", "value": 3 },
        { "label": "Every 3 Days", "description": "", "value": 4 },
        { "label": "Every Week", "description": "", "value": 5 }
    ];
    static MAXIMUS_IMAGES = [
        { "title": "Servitude in the Dark", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182365001322507/berry_350.jpg?ex=6732194c&is=6730c7cc&hm=2dd48990b326f3978a774194643bef2b6251106126a5c8d55b820b587eb034cb&=&format=webp" },
        { "title": "Reluctant Hands Obeying", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182365299114056/blame_350.jpg?ex=6732194d&is=6730c7cd&hm=ea8f8b76ed2f4133c20f90d2c43310e90cff20550b627e242e134a8ae6acdd7d&=&format=webp" },
        { "title": "Conscience Buried Deep", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182365630595242/contemplation_350.jpg?ex=6732194d&is=6730c7cd&hm=7b1516e03c337e99cb23e55742caf453e4f80949e92e15802e09e75894566959&=&format=webp" },
        { "title": "Embrace of Lurking Malice", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182365953298533/discontent_350.jpg?ex=6732194d&is=6730c7cd&hm=c8f131b22ef86b84599d4afb00f032f3a62adfa2d427333610827afd809d3291&=&format=webp" },
        { "title": "Duty Bound by Shadows", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182366221729822/excited_350.jpg?ex=6732194d&is=6730c7cd&hm=02f88c94a7a8c303e457a026e1d8fe361a3c2c879d9222d94f989bdb502b60a9&=&format=webp" },
        { "title": "Dirty Deeds, Loyal Heart", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182366486106242/explanation_350.jpg?ex=6732194d&is=6730c7cd&hm=0d436265efbbf7822ff54ce17700c4600cccacceefa936cac23a29f4124a2eeb&=&format=webp" },
        { "title": "Loyalty Veiled in Gloom", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182367018778705/explanation2_350.jpg?ex=6732194d&is=6730c7cd&hm=077ee81bbe2e6b250c7d32511056cff46f6001ff7a4ca07feed35176f7236008&=&format=webp" },
        { "title": "Adoration Barely Concealed", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182367278960760/mee_350.jpg?ex=6732194d&is=6730c7cd&hm=0f808119e1cc4521a33255cd85566cdc1e15395c7445282e3d1c50d9ce8f4dae&=&format=webp" },
        { "title": "Evil Unbound", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182410937204857/sus_350.jpg?ex=67321957&is=6730c7d7&hm=6bc96d739ea5dcb5e415fc9f19b8fcc7ddac8b1fedb4c8b3736458d6efe0546f&=&format=webp" },
        { "title": "Villainy with Flair", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182411331731497/vlcsnap-00012_350.png?ex=67321957&is=6730c7d7&hm=d49c4c4f773471a0eb819e458cf9626b09cbfe244eb987ed746887d5a3cd1c34&=&format=webp&quality=lossless" },
        { "title": "Sinister Skill", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182411650240522/vlcsnap-00013_350.png?ex=67321958&is=6730c7d8&hm=3c2a2400ca4bce6cfd4d8182d07a2178a01dc314b7b8bf0415d736a19cca782d&=&format=webp&quality=lossless" },
        { "title": "Poised in Ruthless Power", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182411981721744/vlcsnap-00014_350.png?ex=67321958&is=6730c7d8&hm=f05b63d987f44616c0fbdfd48741030ccc0ef3dc91500dd6b5406271d4222d7d&=&format=webp&quality=lossless" },
        { "title": "Darkness without Witness", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182412392632360/vlcsnap-00017_350.png?ex=67321958&is=6730c7d8&hm=75e3f77fa83e9e585b6551e272ea135509e6bc01648226d00e1bc641587b309b&=&format=webp&quality=lossless" },
        { "title": "Commanding Dark Finesse", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182412770381864/vlcsnap-00031_350.png?ex=67321958&is=6730c7d8&hm=4faf9bdcc66af258e7714f11716d7a24ae10e94765fcf575d7c5220b9bcca6b5&=&format=webp&quality=lossless" },
        { "title": "Swagger in Sinister Craft", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182413109858334/vlcsnap-00037_350.png?ex=67321958&is=6730c7d8&hm=3a82a5c38f40f99c7eec5f896ea509cfbafeca1461d89aa1dbe10f2570d17050&=&format=webp&quality=lossless" },
        { "title": "Hidden Menace", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182413411979304/vlcsnap-00043_350.png?ex=67321958&is=6730c7d8&hm=33d28807d27360b177a6c8924b83b14c36b4019f28313ad757c74795478b5032&=&format=webp&quality=lossless" },
        { "title": "Siphoning Darkness", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182453731692605/vlcsnap-00049_350.png?ex=67321962&is=6730c7e2&hm=9d13dba32752b864e9e1db147de7001c55ff3afcc33df617f06aea9a93155ed7&=&format=webp&quality=lossless" },
        { "title": "Willing Pawn", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182453966704761/vlcsnap-00079_350.png?ex=67321962&is=6730c7e2&hm=9ee1d555d367749a18f1760f8120bd9ef6d1c54885137e1690b97c2b5d56c4a2&=&format=webp&quality=lossless" },
        { "title": "Faithful to a Fault", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182454260437042/vlcsnap-00082_350.png?ex=67321962&is=6730c7e2&hm=84ac5028b3c0c09c281289f7bd3ebce5c425fa6f0038ed2fcde920e9f49e0332&=&format=webp&quality=lossless" },
        { "title": "Devotion in Every Glance", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182454625079348/vlcsnap-00083_350.png?ex=67321962&is=6730c7e2&hm=30c6419981966b28cb51e0d2f8a551b3b6c72e0c10df3d7d4d18ad1ca91cd2aa&=&format=webp&quality=lossless" },
        { "title": "Wielding Wickedness", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182454939783238/vlcsnap-00139_350.png?ex=67321962&is=6730c7e2&hm=3fdce975ff74723ec60c5af95aeae0975b1d8a8b2fb5d6a4b8e849830f532bd6&=&format=webp&quality=lossless" },
        { "title": "Shadowed Prowess", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182455246098503/vlcsnap-00141_350.png?ex=67321962&is=6730c7e2&hm=e58de3012974329c84b5bc23e08cfe47d313e99d5fbb8f87a9a09c24066f9d2d&=&format=webp&quality=lossless" },
        { "title": "Poised for Silent Treachery", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182455560409169/vlcsnap-00152_350.png?ex=67321962&is=6730c7e2&hm=9094b2d14e307f1e2c3f3cbdcf8d07ed15f2f875543dd793f920408e4fbfe03c&=&format=webp&quality=lossless" },
        { "title": "Betrayal Cloaked in Charm", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182455816392704/vlcsnap-00183_350.png?ex=67321962&is=6730c7e2&hm=876e9bcc6395ed7aa6beed0d7ddd7699e4d646167310aae25c485d31cb7c0a0f&=&format=webp&quality=lossless" },
        { "title": "Faithful yet Flawed", "url": "https://media.discordapp.net/attachments/1305182222214496288/1305182483444404374/vlcsnap-00186_350.png?ex=67321969&is=6730c7e9&hm=6a66a8eabb675669bf280444b19e22f58a4aa4ffffd6de7758eefad6993812d7&=&format=webp&quality=lossless" }
    ];
}
exports.BCONST = BCONST;
// export the class to be used by main.ts
