import {QuestionChannelI} from "../data_interfaces/questionChannel"

class QuestionChannelO_Changes {

    qch_id: number;
    server: boolean = false;
    channel: boolean = false;
    owner: boolean = false;
    date: boolean = false;
    question: boolean = false;

    private changes = new Array<string>();

    constructor(qch_id: number) {
        this.qch_id = qch_id;
    }

    public change_asked_questions() {
        if (this.question) return;
        this.question= true;
        this.changes.push("question");
    }
    
    public generateChanges(): Array<string> {
        return this.changes;        
    }

    public isChanges(): boolean {
        return !!(this.changes.length);
    }
}

export class QuestionChannelO {
    private qch_id: number;
    private server: string | null;
    private channel: string;
    private owner: string;
    private date: number;
    private question: number;

    private changes: QuestionChannelO_Changes;

    constructor(json: QuestionChannelI) {
        this.qch_id = json.qch_id;
        this.server = json.server;
        this.channel = json.channel;
        this.owner = json.owner;
        this.date = json.date;
        this.question = json.question;
            
        this.changes = new QuestionChannelO_Changes(this.qch_id);
    }

    public getQuestionChannelID(): number {
        return this.qch_id;
    }

    public getServer(): string | null {
        return this.server;
    }

    public getChannel(): string {
        return this.channel;
    }

    public getOwner(): string {
        return this.owner;
    }

    public getQuestionsAsked(): number {
        return this.question;
    }

    public setQuestionsAsked(value: number): boolean {
        this.question = value;
        this.changes.change_asked_questions();
        return true;
    }

    public getDate(): number {
        return this.date;
    }
    
    public isChanges(): boolean {
        return this.changes.isChanges();
    }

    public getChanges(): Array<string> {
        return this.changes.generateChanges();
    }

}