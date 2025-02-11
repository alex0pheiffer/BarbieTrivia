import {ProposalI} from "../data_interfaces/proposal"
import { QuestionI } from "../data_interfaces/question";
import {DBC} from "../sql/Database_Constants"

class ProposalO_Changes {

    proposal_id: number;
    question: boolean = false;
    image: boolean = false;
    ans_a: boolean = false;
    ans_b: boolean = false;
    ans_c: boolean = false;
    ans_d: boolean = false;
    d_always_last: boolean = false;
    fun_fact: boolean = false;
    correct: boolean = false;
    date: boolean = false;
    submitter: boolean = false;
    submitted: boolean = false;
    accepted: boolean = false;
    declined: boolean = false;
    message_id: boolean = false;

    private changes = new Array<string>();

    constructor(proposal_id: number) {
        this.proposal_id = proposal_id;
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

    public change_correct() {
        if (this.correct) return;
        this.correct = true;
        this.changes.push("correct");
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

    public change_submitted() {
        if (this.submitted) return;
        this.submitted = true;
        this.changes.push("submitted");
    }

    public change_accepted() {
        if (this.accepted) return;
        this.accepted = true;
        this.changes.push("accepted");
    }

    public change_declined() {
        if (this.declined) return;
        this.declined = true;
        this.changes.push("declined");
    }

    public change_message_id() {
        if (this.message_id) return;
        this.message_id = true;
        this.changes.push("message_id");
    }
    
    public generateChanges(): Array<string> {
        return this.changes;        
    }

    public isChanges(): boolean {
        return !!(this.changes.length);
    }

}

export class ProposalO {
    private proposal_id: number | null;
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
    private submitted: number;
    private accepted: number;
    private declined: number;
    private message_id: string;

    private changes: ProposalO_Changes;

    constructor(json: ProposalI) {
        this.proposal_id = json.proposal_id;
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
        this.submitted = json.submitted;
        this.accepted = json.accepted;
        this.declined = json.declined;
        this.message_id = json.message_id;

        this.changes = new ProposalO_Changes(this.proposal_id);
    }

    public getProposalID(): number | null {
        return this.proposal_id;
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

    public getSubmitted(): number {
        return this.submitted;
    }

    public getAccepted(): number {
        return this.accepted;
    }

    public getDeclined(): number {
        return this.declined;
    }

    public getMessageID(): string {
        return this.message_id;
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

    public setSubmitted(value: number): boolean {
        this.submitted = value;
        this.changes.change_submitted();
        return true;
    }

    public setAccepted(value: number): boolean {
        this.accepted = value;
        this.changes.change_accepted();
        return true;
    }

    public setDeclined(value: number): boolean {
        this.declined = value;
        this.changes.change_declined();
        return true;
    }

    public setMessageID(value: string): boolean {
        this.message_id = value;
        this.changes.change_message_id();
        return true;
    }
    
    public isChanges(): boolean {
        return this.changes.isChanges();
    }

    public getChanges(): Array<string> {
        return this.changes.generateChanges();
    }

    public getQuestionI(): QuestionI {
        let qi: QuestionI = {
            "question_id": 0,
            "question": this.question,
            "image": this.image,
            "ans_a": this.ans_a,
            "ans_b": this.ans_b,
            "ans_c": this.ans_c,
            "ans_d": this.ans_d,
            "d_always_last": this.d_always_last,
            "fun_fact": this.fun_fact,
            "correct": this.correct,
            "date": this.date,
            "submitter": this.submitter,
            "response_total": 0,
            "response_correct": 0,
            "shown_total": 0} as QuestionI;

        return qi;
    }
        

}