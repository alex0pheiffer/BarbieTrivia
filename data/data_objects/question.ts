import {QuestionI} from "../data_interfaces/question"
import {DBC} from "../sql/Database_Constants"

class QuestionO_Changes {

    private question_id: number;
    private question: boolean = false;
    private image: boolean = false;
    private ans_a: boolean = false;
    private ans_b: boolean = false;
    private ans_c: boolean = false;
    private ans_d: boolean = false;
    private d_always_last: boolean = false;
    private fun_fact: boolean = false;
    private correct: boolean = false;
    private date: boolean = false;
    private submitter: boolean = false;
    private response_total: boolean = false;
    private response_correct: boolean = false;
    private shown_total: boolean = false;

    private changes = new Array<string>();

    constructor(question_id: number) {
        this.question_id = question_id;
    }

    public change_question() {
        if (this.question) return;
        this.question = true;
        this.changes.push("question");
    }

    public change_image() {
        if (this.image) return;
        this.image = true;
        this.changes.push("image");
    }
    
    public change_ans_a() {
        if (this.ans_a) return;
        this.ans_a = true;
        this.changes.push("ans_a");
    }

    public change_ans_b() {
        if (this.ans_b) return;
        this.ans_b = true;
        this.changes.push("ans_b");
    }

    public change_ans_c() {
        if (this.ans_c) return;
        this.ans_c = true;
        this.changes.push("ans_c");
    }

    public change_ans_d() {
        if (this.ans_d) return;
        this.ans_d = true;
        this.changes.push("ans_d");
    }

    public change_d_always_last() {
        if (this.d_always_last) return;
        this.d_always_last = true;
        this.changes.push("d_always_last");
    }

    public change_fun_fact() {
        if (this.fun_fact) return;
        this.fun_fact = true;
        this.changes.push("fun_fact");
    }
    
    public change_date() {
        if (this.date) return;
        this.date = true;
        this.changes.push("date");
    }

    public change_submitter() {
        if (this.submitter) return;
        this.submitter = true;
        this.changes.push("submitter");
    }
    
    public change_correct() {
        if (this.correct) return;
        this.correct = true;
        this.changes.push("correct");
    }

    public change_response_total() {
        if (this.response_total) return;
        this.response_total= true;
        this.changes.push("response_total");
    }
    
    public change_response_correct() {
        if (this.response_correct) return;
        this.response_correct= true;
        this.changes.push("response_correct");
    }

    public change_shown_total() {
        if (this.shown_total) return;
        this.shown_total= true;
        this.changes.push("shown_total");
    }
    
    public generateChanges(): Array<string> {
        return this.changes;        
    }

    public isChanges(): boolean {
        return !!(this.changes.length);
    }
}

export class QuestionO {
    private question_id: number;
    private question: string;
    private image: string;
    private ans_a: string;
    private ans_b: string;
    private ans_c: string;
    private ans_d: string;
    private d_always_last: number;
    private fun_fact: string;
    private correct: number;
    private date: number;
    private submitter: string;
    private response_total: number;
    private response_correct: number;
    private shown_total: number;

    private changes: QuestionO_Changes;

    constructor(json: QuestionI) {
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

    public getQuestionID(): number {
        return this.question_id;
    }

    public getQuestion(): string {
        return this.question;
    }

    public getImage(): string {
        return this.image;
    }

    public getAnswer(ans: string) {
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
    public getAnswers(): Array<string> {
        return [this.ans_a, this.ans_b, this.ans_c, this.ans_d];
    }

    public getAnswersScrambled(): Array<string> {
        let list = [this.ans_a, this.ans_b, this.ans_c];
        if (!this.d_always_last) {
            list.push(this.ans_d);
        }
        
        list = list.sort( ()=>Math.random()-0.5 );
        
        if (this.d_always_last) {
            list.push(this.ans_d);
        }
        return list;
    }

    public getDAlwaysLast(): number {
        return this.d_always_last;
    }

    public getFunFact(): string {
        return this.fun_fact;
    }

    public getCorrect(): number {
        return this.correct;
    }

    public getDate(): number {
        return this.date;
    }

    public getSubmitter(): string {
        return this.submitter;
    }

    public getResponseTotal(): number {
        return this.response_total;
    }

    public getResponseCorrect(): number {
        return this.response_correct;
    }

    public getShownTotal(): number {
    return this.shown_total;
    }

    public setQuestion(value: string): boolean {
        if (value.length > DBC.question_length) {
            return false;
        }
        this.question = value;
        this.changes.change_question();
        return true;
    }

    public setImage(value: string): boolean {
        if (value.length > DBC.image_length) {
            return false;
        }
        this.image = value;
        this.changes.change_image();
        return true;
    }

    public setAnsA(value: string): boolean {
        if (value.length > DBC.answer_length) {
            return false;
        }
        this.ans_a = value;
        this.changes.change_ans_a();
        return true;
    }

    public setAnsB(value: string): boolean {
        if (value.length > DBC.answer_length) {
            return false;
        }
        this.ans_b = value;
        this.changes.change_ans_b();
        return true;
    }

    public setAnsC(value: string): boolean {
        if (value.length > DBC.answer_length) {
            return false;
        }
        this.ans_c = value;
        this.changes.change_ans_c();
        return true;
    }
    
    public setAnsD(value: string): boolean {
        if (value.length > DBC.answer_length) {
            return false;
        }
        this.ans_d = value;
        this.changes.change_ans_d();
        return true;
    }

    public setDAlwaysLast(value: boolean): boolean {
        if (value) {
            this.d_always_last = 1;
        }
        else {
            this.d_always_last = 0;
        }
        this.changes.change_d_always_last();
        return true;
    }

    public setFunFact(value: string): boolean {
        if (value.length > DBC.funfact_length) {
            return false;
        }
        this.fun_fact = value;
        this.changes.change_fun_fact();
        return true;
    }

    public setCorrect(value: number): boolean {
        if (value > 3 || value < 0) {
            return false;
        }
        this.correct = value;
        this.changes.change_correct();
        return true;
    }

    public setDate(value: number): boolean {
        this.date = value;
        this.changes.change_date();
        return true;
    }

    public setSubmitter(value: string): boolean {
        if (value.length > DBC.userID_length) {
            return false;
        }
        this.submitter = value;
        this.changes.change_submitter();
        return true;
    }
    
    public isChanges(): boolean {
        return this.changes.isChanges();
    }

    public getChanges(): Array<string> {
        return this.changes.generateChanges();
    }
}