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

    // TODO add the change functions
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

    public getServer(): string | null {
        return this.server;
    }

    public getChannel(): string {
        return this.channel;
    }

    public getOwner(): string {
        return this.owner;
    }

    public getQuestionID(): number {
        return this.question;
    }

    public getDate(): number {
        return this.date;
    }

}