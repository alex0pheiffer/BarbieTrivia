"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionChannelO = void 0;
class QuestionChannelO_Changes {
    qch_id;
    server = false;
    channel = false;
    owner = false;
    date = false;
    question = false;
    changes = new Array();
    constructor(qch_id) {
        this.qch_id = qch_id;
    }
}
class QuestionChannelO {
    qch_id;
    server;
    channel;
    owner;
    date;
    question;
    changes;
    constructor(json) {
        this.qch_id = json.qch_id;
        this.server = json.server;
        this.channel = json.channel;
        this.owner = json.owner;
        this.date = json.date;
        this.question = json.question;
        this.changes = new QuestionChannelO_Changes(this.qch_id);
    }
    getServer() {
        return this.server;
    }
    getChannel() {
        return this.channel;
    }
    getOwner() {
        return this.owner;
    }
    getQuestionID() {
        return this.question;
    }
    getDate() {
        return this.date;
    }
}
exports.QuestionChannelO = QuestionChannelO;
