"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionO = void 0;
const Database_Constants_1 = require("../sql/Database_Constants");
class QuestionO_Changes {
    question_id;
    question = false;
    image = false;
    ans_a = false;
    ans_b = false;
    ans_c = false;
    ans_d = false;
    d_always_last = false;
    fun_fact = false;
    correct = false;
    date = false;
    submitter = false;
    response_total = false;
    response_correct = false;
    shown_total = false;
    changes = new Array();
    constructor(question_id) {
        this.question_id = question_id;
    }
    change_question() {
        if (this.question)
            return;
        this.question = true;
        this.changes.push("question");
    }
    change_image() {
        if (this.image)
            return;
        this.image = true;
        this.changes.push("image");
    }
    change_ans_a() {
        if (this.ans_a)
            return;
        this.ans_a = true;
        this.changes.push("ans_a");
    }
    change_ans_b() {
        if (this.ans_b)
            return;
        this.ans_b = true;
        this.changes.push("ans_b");
    }
    change_ans_c() {
        if (this.ans_c)
            return;
        this.ans_c = true;
        this.changes.push("ans_c");
    }
    change_ans_d() {
        if (this.ans_d)
            return;
        this.ans_d = true;
        this.changes.push("ans_d");
    }
    change_d_always_last() {
        if (this.d_always_last)
            return;
        this.d_always_last = true;
        this.changes.push("d_always_last");
    }
    change_fun_fact() {
        if (this.fun_fact)
            return;
        this.fun_fact = true;
        this.changes.push("fun_fact");
    }
    change_date() {
        if (this.date)
            return;
        this.date = true;
        this.changes.push("date");
    }
    change_submitter() {
        if (this.submitter)
            return;
        this.submitter = true;
        this.changes.push("submitter");
    }
    change_correct() {
        if (this.correct)
            return;
        this.correct = true;
        this.changes.push("correct");
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
    change_shown_total() {
        if (this.shown_total)
            return;
        this.shown_total = true;
        this.changes.push("shown_total");
    }
    generateChanges() {
        return this.changes;
    }
    isChanges() {
        return !!(this.changes.length);
    }
}
class QuestionO {
    question_id;
    question;
    image;
    ans_a;
    ans_b;
    ans_c;
    ans_d;
    d_always_last;
    fun_fact;
    correct;
    date;
    submitter;
    response_total;
    response_correct;
    shown_total;
    changes;
    constructor(json) {
        this.question_id = json.question_id;
        this.question = json.question;
        this.image = json.image;
        this.ans_a = json.ans_a;
        this.ans_b = json.ans_b;
        this.ans_c = json.ans_c;
        this.ans_d = json.ans_d;
        this.d_always_last = json.d_always_last;
        this.fun_fact = json.fun_fact;
        this.correct = json.correct;
        this.date = json.date;
        this.submitter = json.submitter;
        this.response_total = json.response_total;
        this.response_correct = json.response_correct;
        this.shown_total = json.shown_total;
        this.changes = new QuestionO_Changes(this.question_id);
    }
    getQuestionID() {
        return this.question_id;
    }
    getQuestion() {
        return this.question;
    }
    getImage() {
        return this.image;
    }
    getAnswer(ans) {
        switch (ans) {
            case "ans_a":
                return this.ans_a;
            case "ans_b":
                return this.ans_b;
            case "ans_c":
                return this.ans_c;
            case "ans_d":
                return this.ans_d;
        }
        return "";
    }
    // returns the answers in their original order
    getAnswers() {
        return [this.ans_a, this.ans_b, this.ans_c, this.ans_d];
    }
    getAnswersScrambled(scramble = true) {
        let list = [{ "i": 0, "ans": this.ans_a },
            { "i": 1, "ans": this.ans_b },
            { "i": 2, "ans": this.ans_c }];
        if (!this.d_always_last || !scramble) {
            list.push({ "i": 3, "ans": this.ans_d });
        }
        if (scramble) {
            list = list.sort(() => Math.random() - 0.5);
            if (this.d_always_last) {
                list.push({ "i": 3, "ans": this.ans_d });
            }
        }
        return list;
    }
    getDAlwaysLast() {
        return this.d_always_last;
    }
    getFunFact() {
        return this.fun_fact;
    }
    getCorrect() {
        return this.correct;
    }
    getDate() {
        return this.date;
    }
    getSubmitter() {
        return this.submitter;
    }
    getResponseTotal() {
        return this.response_total;
    }
    getResponseCorrect() {
        return this.response_correct;
    }
    getShownTotal() {
        return this.shown_total;
    }
    setQuestion(value) {
        if (value.length > Database_Constants_1.DBC.question_length) {
            return false;
        }
        this.question = value;
        this.changes.change_question();
        return true;
    }
    setImage(value) {
        if (value.length > Database_Constants_1.DBC.image_length) {
            return false;
        }
        this.image = value;
        this.changes.change_image();
        return true;
    }
    setAnsA(value) {
        if (value.length > Database_Constants_1.DBC.answer_length) {
            return false;
        }
        this.ans_a = value;
        this.changes.change_ans_a();
        return true;
    }
    setAnsB(value) {
        if (value.length > Database_Constants_1.DBC.answer_length) {
            return false;
        }
        this.ans_b = value;
        this.changes.change_ans_b();
        return true;
    }
    setAnsC(value) {
        if (value.length > Database_Constants_1.DBC.answer_length) {
            return false;
        }
        this.ans_c = value;
        this.changes.change_ans_c();
        return true;
    }
    setAnsD(value) {
        if (value.length > Database_Constants_1.DBC.answer_length) {
            return false;
        }
        this.ans_d = value;
        this.changes.change_ans_d();
        return true;
    }
    setDAlwaysLast(value) {
        if (value) {
            this.d_always_last = 1;
        }
        else {
            this.d_always_last = 0;
        }
        this.changes.change_d_always_last();
        return true;
    }
    setFunFact(value) {
        if (value.length > Database_Constants_1.DBC.funfact_length) {
            return false;
        }
        this.fun_fact = value;
        this.changes.change_fun_fact();
        return true;
    }
    setCorrect(value) {
        if (value > 3 || value < 0) {
            return false;
        }
        this.correct = value;
        this.changes.change_correct();
        return true;
    }
    setDate(value) {
        this.date = value;
        this.changes.change_date();
        return true;
    }
    setSubmitter(value) {
        if (value.length > Database_Constants_1.DBC.userID_length) {
            return false;
        }
        this.submitter = value;
        this.changes.change_submitter();
        return true;
    }
    setShownTotal(value) {
        this.shown_total = value;
        this.changes.change_shown_total();
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
exports.QuestionO = QuestionO;
