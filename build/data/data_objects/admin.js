"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminO = void 0;
class AdminO_Changes {
    admin_id;
    user = false;
    granter = false;
    changes = new Array();
    constructor(admin_id) {
        this.admin_id = admin_id;
    }
}
class AdminO {
    admin_id;
    user;
    granter;
    changes;
    constructor(json) {
        this.admin_id = json.admin_id;
        this.user = json.user;
        this.granter = json.granter;
        this.changes = new AdminO_Changes(this.admin_id);
    }
    getAdminID() {
        return this.admin_id;
    }
    getAdmin() {
        return this.user;
    }
    getGranter() {
        return this.granter;
    }
}
exports.AdminO = AdminO;
