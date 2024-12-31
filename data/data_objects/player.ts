import { PlayerI } from "../data_interfaces/player";

class PlayerO_Changes {

    player_id: number;
    user: boolean = false;
    q_submitted: boolean = false;
    response_total: boolean = false;
    response_correct: boolean = false;

    private changes = new Array<string>();

    constructor(player_id: number) {
        this.player_id = player_id;
    }

    public change_q_submitted() {
        if (this.q_submitted) return;
        this.q_submitted = true;
        this.changes.push("q_submitted");
    }

    public change_response_total() {
        if (this.response_total) return;
        this.response_total = true;
        this.changes.push("response_total");
    }

    public change_response_correct() {
        if (this.response_correct) return;
        this.response_correct = true;
        this.changes.push("response_correct");
    }
    
    public generateChanges(): Array<string> {
        return this.changes;        
    }

    public isChanges(): boolean {
        return !!(this.changes.length);
    }
}

export class PlayerO {
    private player_id: number;
    private user: string;
    private q_submitted: number;
    private response_total: number;
    private response_correct: number;

    private changes: PlayerO_Changes;

    constructor(json: PlayerI) {
        this.player_id = json.player_id;
        this.user = json.user;
        this.q_submitted = json.q_submitted;
        this.response_total = json.response_total;
        this.response_correct = json.response_correct;
        this.changes = new PlayerO_Changes(this.player_id);
    }

    public getPlayerID(): number {
        return this.player_id;
    }

    public getPlayer(): string {
        return this.user;
    }

    public getQSubmitted(): number {
        return this.q_submitted;
    }

    public getResponseTotal(): number {
        return this.response_total;
    }

    public getResponseCorrect(): number {
        return this.response_correct;
    }

    public setQSubmitted(value: number): boolean {
        this.q_submitted = value;
        this.changes.change_q_submitted();
        return true;
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
    
    public isChanges(): boolean {
        return this.changes.isChanges();
    }

    public getChanges(): Array<string> {
        return this.changes.generateChanges();
    }

}