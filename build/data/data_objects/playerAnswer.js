"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAnswerO = void 0;
class PlayerAnswerO_Changes {
    answer_id;
    ask_id = false;
    response = false;
    submitted = false;
    changes = new Array();
    constructor(answer_id) {
        this.answer_id = answer_id;
    }
    change_ask_id() {
        if (this.ask_id)
            return;
        this.ask_id = true;
        this.changes.push("ask_id");
    }
    change_response() {
        if (this.response)
            return;
        this.response = true;
        this.changes.push("response");
    }
    change_submitted() {
        if (this.submitted)
            return;
        this.submitted = true;
        this.changes.push("submitted");
    }
    generateChanges() {
        return this.changes;
    }
    isChanges() {
        return !!(this.changes.length);
    }
}
class PlayerAnswerO {
    answer_id;
    user;
    ask_id;
    response;
    submitted;
    changes;
    constructor(json) {
        this.answer_id = json.answer_id;
        this.user = json.user;
        this.ask_id = json.ask_id;
        this.response = json.response;
        this.submitted = json.submitted;
        this.changes = new PlayerAnswerO_Changes(this.answer_id);
    }
    getAnswerID() {
        return this.answer_id;
    }
    getUser() {
        return this.user;
    }
    getAskID() {
        return this.ask_id;
    }
    getResponse() {
        return this.response;
    }
    getSubmtitted() {
        return this.submitted;
    }
    setAskID(value) {
        this.ask_id = value;
        this.changes.change_ask_id();
        return true;
    }
    setResponse(value) {
        this.response = value;
        this.changes.change_response();
        return true;
    }
    setSubmitted(value) {
        this.submitted = value;
        this.changes.change_submitted();
        return true;
    }
    isChanges() {
        return this.changes.isChanges();
    }
    getChanges() {
        return this.changes.generateChanges();
    }
}
exports.PlayerAnswerO = PlayerAnswerO;
