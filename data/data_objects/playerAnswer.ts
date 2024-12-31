import { PlayerAnswerI } from "../data_interfaces/playerAnswer";

class PlayerAnswerO_Changes {
    answer_id: number;
    ask_id: boolean = false;
    response: boolean = false;
    submitted: boolean = false;
    
    private changes = new Array<string>();

    constructor(answer_id: number) {
        this.answer_id = answer_id;
    }

    public change_ask_id() {
        if (this.ask_id) return;
        this.ask_id= true;
        this.changes.push("ask_id");
    }
    
    public change_response() {
        if (this.response) return;
        this.response= true;
        this.changes.push("response");
    }

    public change_submitted() {
        if (this.submitted) return;
        this.submitted = true;
        this.changes.push("submitted");
    }

    public generateChanges(): Array<string> {
        return this.changes;        
    }

    public isChanges(): boolean {
        return !!(this.changes.length);
    }
}

export class PlayerAnswerO {
    private answer_id: number;
    private user: string;
    private ask_id: number;
    private response: number;
    private submitted: number;
    
    private changes: PlayerAnswerO_Changes;

    constructor(json: PlayerAnswerI) {
        this.answer_id = json.answer_id;
        this.user = json.user;
        this.ask_id = json.ask_id;
        this.response = json.response;
        this.submitted = json.submitted;
        
        this.changes = new PlayerAnswerO_Changes(this.answer_id);
    }

    public getAnswerID(): number {
        return this.answer_id;
    }

    public getUser(): string {
        return this.user;
    }

    public getAskID(): number {
        return this.ask_id;
    }

    public getResponse(): number {
        return this.response;
    }

    public getSubmtitted(): number {
        return this.submitted;
    }

    public setAskID(value: number): boolean {
        this.ask_id = value;
        this.changes.change_ask_id();
        return true;
    }

    public setResponse(value: number): boolean {
        this.response = value;
        this.changes.change_response();
        return true;
    }
    
    public setSubmitted(value: number): boolean {
        this.submitted = value;
        this.changes.change_submitted();
        return true;
    }

    public isChanges(): boolean {
        return this.changes.isChanges();
    }

    public getChanges(): Array<string> {
        return this.changes.generateChanges();
    }

}