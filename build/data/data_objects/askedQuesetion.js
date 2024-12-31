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
    active = false;
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
    change_active() {
        if (this.active)
            return;
        this.active = true;
        this.changes.push("active");
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
    active;
    ans_a;
    ans_b;
    ans_c;
    ans_d;
    max_img;
    changes;
    constructor(json) {
        this.ask_id = json.ask_id;
        this.channel_id = json.channel_id;
        this.question_id = json.question_id;
        this.date = json.date;
        this.response_total = json.response_total;
        this.response_correct = json.response_correct;
        this.active = json.active;
        this.ans_a = json.ans_a;
        this.ans_b = json.ans_b;
        this.ans_c = json.ans_c;
        this.ans_d = json.ans_d;
        this.max_img = json.max_img;
        this.changes = new AskedQuestionO_Changes(this.ask_id);
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
    getActive() {
        return this.active;
    }
    getAnsA() {
        return this.ans_a;
    }
    getAnsB() {
        return this.ans_b;
    }
    getAnsC() {
        return this.ans_c;
    }
    getAnsD() {
        return this.ans_d;
    }
    getMaxImg() {
        return this.max_img;
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
    setActive(value) {
        this.active = value;
        this.changes.change_active();
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
