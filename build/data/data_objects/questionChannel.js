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
    change_owner() {
        if (this.owner)
            return;
        this.owner = true;
        this.changes.push("owner");
    }
    change_channel() {
        if (this.channel)
            return;
        this.channel = true;
        this.changes.push("channel");
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
    getDate() {
        return this.date;
    }
    setQuestionsAsked(value) {
        this.question = value;
        this.changes.change_asked_questions();
        return true;
    }
    setOwner(value) {
        this.owner = value;
        this.changes.change_owner();
        return true;
    }
    setChannel(value) {
        this.channel = value;
        this.changes.change_channel();
        return true;
    }
    isChanges() {
        return this.changes.isChanges();
    }
    getChanges() {
        return this.changes.generateChanges();
    }
}
exports.QuestionChannelO = QuestionChannelO;
