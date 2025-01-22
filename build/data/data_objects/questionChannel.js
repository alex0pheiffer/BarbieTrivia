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
    change_asked_questions() {
        if (this.question)
            return;
        this.question = true;
        this.changes.push("question");
    }
    generateChanges() {
        return this.changes;
    }
    isChanges() {
        return !!(this.changes.length);
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
    getQuestionChannelID() {
        return this.qch_id;
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
    getQuestionsAsked() {
        return this.question;
    }
    setQuestionsAsked(value) {
        this.question = value;
        this.changes.change_asked_questions();
        return true;
    }
    getDate() {
        return this.date;
    }
    isChanges() {
        return this.changes.isChanges();
    }
    getChanges() {
        return this.changes.generateChanges();
    }
}
exports.QuestionChannelO = QuestionChannelO;
