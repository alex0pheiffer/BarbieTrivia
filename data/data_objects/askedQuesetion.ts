import { ShuffledAnswerItem } from "../component_interfaces/shuffled_answer";
import {AskedQuestionI} from "../data_interfaces/askedQuestion"
import { QuestionO } from "./question";

class AskedQuestionO_Changes {
    ask_id: number;
    qch_id: boolean = false;
    question_id: boolean = false;
    date: boolean = false;
    response_total: boolean = false;
    response_correct: boolean = false;
    active: boolean = false;
    message_id: boolean = false;
    next_question_time: boolean = false;
    show_result_time: boolean = false;
    
    private changes = new Array<string>();

    constructor(ask_id: number) {
        this.ask_id = ask_id;
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

    public change_active() {
        if (this.active) return;
        this.active = true;
        this.changes.push("active");
    }
    
    public change_message_id() {
        if (this.message_id) return;
        this.message_id = true;
        this.changes.push("message_id");
    }

    public change_next_question_time() {
        if (this.next_question_time) return;
        this.next_question_time = true;
        this.changes.push("next_question_time");
    }
    
    public change_show_result_time() {
        if (this.show_result_time) return;
        this.show_result_time = true;
        this.changes.push("show_result_time");
    }
    
    public generateChanges(): Array<string> {
        return this.changes;        
    }

    public isChanges(): boolean {
        return !!(this.changes.length);
    }
}

export class AskedQuestionO {
    private ask_id: number;
    private channel_id: string;
    private question_id: number;
    private date: number;
    private response_total: number;
    private response_correct: number;
    private active: number;
    private ans_a: number;
    private ans_b: number;
    private ans_c: number;
    private ans_d: number;
    private max_img: number;
    private message_id: string;
    private next_question_time: number;
    private show_result_time: number;

    private changes: AskedQuestionO_Changes;

    constructor(json: AskedQuestionI) {
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
        this.message_id = json.message_id;
        this.next_question_time = json.next_question_time;
        this.show_result_time = json.show_result_time;

        this.changes = new AskedQuestionO_Changes(this.ask_id);
    }

    public getAskID(): number {
        return this.ask_id;
    }

    public getChannelID(): string {
        return this.channel_id;
    }

    public getQuestionID(): number {
        return this.question_id;
    }

    public getDate(): number {
        return this.date;
    }

    public getResponseTotal(): number {
        return this.response_total;
    }

    public getResponseCorrect(): number {
        return this.response_correct;
    }

    public getActive(): number {
        return this.active;
    }

    public getAnsA(): number {
        return this.ans_a;
    }

    public getAnsB(): number {
        return this.ans_b;
    }

    public getAnsC(): number {
        return this.ans_c;
    }

    public getAnsD(): number {
        return this.ans_d;
    }

    public getAnswersScrambled(question: QuestionO): Array<ShuffledAnswerItem> {
        let list = [{"i": this.ans_a, "ans": question.getAnswers()[this.ans_a]} as ShuffledAnswerItem, 
            {"i": this.ans_b, "ans": question.getAnswers()[this.ans_b]} as ShuffledAnswerItem, 
            {"i": this.ans_c, "ans": question.getAnswers()[this.ans_c]} as ShuffledAnswerItem,
            {"i": this.ans_d, "ans": question.getAnswers()[this.ans_d]} as ShuffledAnswerItem];
        
        return list;
    }

    public getMaxImg(): number {
        return this.max_img;
    }
    
    public getMessageID(): string {
        return this.message_id;
    }

    public getNextQuestionTime(): number {
        return this.next_question_time;
    }
    
    public getShowResultTime(): number {
        return this.show_result_time;
    }

    public setResponseTotal(value: number): boolean {
        this.response_total = value;
        this.changes.change_response_total();
        return true;
    }

    public setResponseCorrect(value: number): boolean {
        this.response_correct = value;
        this.changes.change_response_correct();
        return true;
    }

    public setActive(value: number): boolean {
        this.active = value;
        this.changes.change_active();
        return true;
    }

    public setMessageID(value: string): boolean {
        this.message_id = value;
        this.changes.change_message_id();
        return true;
    }

    public setNextQuestionTime(value: number): boolean {
        this.next_question_time = value;
        this.changes.change_next_question_time();
        return true;
    }
    
    public setShowResultTime(value: number): boolean {
        this.show_result_time = value;
        this.changes.change_show_result_time();
        return true;
    }
    
    public isChanges(): boolean {
        return this.changes.isChanges();
    }

    public getChanges(): Array<string> {
        return this.changes.generateChanges();
    }

}