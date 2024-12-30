"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskedQuestionO = void 0;
class AskedQuestionO_Changes {
    ask_id;
    qch_id = false;
    question_id = false;
    date = false;
    response_total = false;
    response_correct = false;
    changes = new Array();
    constructor(ask_id) {
        this.ask_id = ask_id;
    }
    change_response_total() {
        if (this.response_total)
            return;
        this.response_total = true;
        this.changes.push("response_total");
    }
    change_response_correct() {
        if (this.response_correct)
            return;
        this.response_correct = true;
        this.changes.push("response_correct");
    }
    generateChanges() {
        return this.changes;
    }
    isChanges() {
        return !!(this.changes.length);
    }
}
class AskedQuestionO {
    ask_id;
    channel_id;
    question_id;
    date;
    response_total;
    response_correct;
    changes;
    constructor(json) {
        this.ask_id = json.ask_id;
        this.channel_id = json.channel_id;
        this.question_id = json.question_id;
        this.date = json.date;
        this.response_total = json.response_total;
        this.response_correct = json.response_correct;
        this.changes = new AskedQuestionO_Changes(this.question_id);
    }
    getAskID() {
        return this.ask_id;
    }
    getChannelID() {
        return this.channel_id;
    }
    getQuestionID() {
        return this.question_id;
    }
    getDate() {
        return this.date;
    }
    getResponseTotal() {
        return this.response_total;
    }
    getResponseCorrect() {
        return this.response_correct;
    }
    setResponseTotal(value) {
        this.response_total = value;
        this.changes.change_response_total();
        return true;
    }
    setResponseCorrect(value) {
        this.response_correct = value;
        this.changes.change_response_correct();
        return true;
    }
    isChanges() {
        return this.changes.isChanges();
    }
    getChanges() {
        return this.changes.generateChanges();
    }
}
exports.AskedQuestionO = AskedQuestionO;
