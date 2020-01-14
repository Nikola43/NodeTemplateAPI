"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
class UsersRoutes {
    constructor() {
        this.router = express_1.Router();
    }
    init() {
        /* GET ALL USERS */
        this.router.get("/", user_controller_1.default.getAll);
        /* GET USER BY ID */
        this.router.get("/:id", user_controller_1.default.getUserById);
        /* INSERT USER */
        this.router.post("/", user_controller_1.default.insertUser);
        /* UPDATE USER BY ID*/
        this.router.patch("/:id", user_controller_1.default.updateUser);
        /* DELETE USER BY ID*/
        this.router.delete("/:id", user_controller_1.default.deleteUser);
    }
}
exports.UsersRoutes = UsersRoutes;
let usersRoutes = new UsersRoutes();
usersRoutes.init();
exports.default = usersRoutes.router;
//# sourceMappingURL=users.js.map