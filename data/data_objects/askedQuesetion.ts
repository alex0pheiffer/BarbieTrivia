import {AskedQuestionI} from "../data_interfaces/askedQuestion"

class AskedQuestionO_Changes {
    ask_id: number;
    qch_id: boolean = false;
    question_id: boolean = false;
    date: boolean = false;
    response_total: boolean = false;
    response_correct: boolean = false;
    active: boolean = false;
    
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

    private changes: AskedQuestionO_Changes;

    constructor(json: AskedQuestionI) {
        this.ask_id = json.ask_id;
        this.channel_id = json.channel_id;
        this.question_id = json.question_id;
        this.date = json.date;
        this.response_total = json.response_total;
        this.response_correct = json.response_correct;
        this.active = json.active;

        this.changes = new AskedQuestionO_Changes(this.question_id);
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
    
    public isChanges(): boolean {
        return this.changes.isChanges();
    }

    public getChanges(): Array<string> {
        return this.changes.generateChanges();
    }

}