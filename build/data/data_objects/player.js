"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerO = void 0;
class PlayerO_Changes {
    player_id;
    user = false;
    q_submitted = false;
    response_total = false;
    response_correct = false;
    changes = new Array();
    constructor(player_id) {
        this.player_id = player_id;
    }
    change_q_submitted() {
        if (this.q_submitted)
            return;
        this.q_submitted = true;
        this.changes.push("q_submitted");
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
class PlayerO {
    player_id;
    user;
    q_submitted;
    response_total;
    response_correct;
    changes;
    constructor(json) {
        this.player_id = json.player_id;
        this.user = json.user;
        this.q_submitted = json.q_submitted;
        this.response_total = json.response_total;
        this.response_correct = json.response_correct;
        this.changes = new PlayerO_Changes(this.player_id);
    }
    getPlayerID() {
        return this.player_id;
    }
    getPlayer() {
        return this.user;
    }
    getQSubmitted() {
        return this.q_submitted;
    }
    getResponseTotal() {
        return this.response_total;
    }
    getResponseCorrect() {
        return this.response_correct;
    }
    setQSubmitted(value) {
        this.q_submitted = value;
        this.changes.change_q_submitted();
        return true;
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
exports.PlayerO = PlayerO;
