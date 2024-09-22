import {AdminI} from "../data_interfaces/admin"

class AdminO_Changes {

    admin_id: number;
    user: boolean = false;
    granter: boolean = false;

    private changes = new Array<string>();

    constructor(admin_id: number) {
        this.admin_id = admin_id;
    }

    // TODO add the change functions
}

export class AdminO {
    private admin_id: number;
    private user: string;
    private granter: string;

    private changes: AdminO_Changes;

    constructor(json: AdminI) {
        this.admin_id = json.admin_id;
        this.user = json.user;
        this.granter = json.granter;
        this.changes = new AdminO_Changes(this.admin_id);
    }

    public getAdmin(): string {
        return this.user;
    }

    public getGranter(): string {
        return this.granter;
    }

}