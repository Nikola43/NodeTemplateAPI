"use strict";
exports.__esModule = true;
var express_1 = require("express");
var user_controller_1 = require("../controllers/user_controller");
var UsersRoutes = /** @class */ (function () {
    function UsersRoutes() {
        this.router = express_1.Router();
    }
    UsersRoutes.prototype.init = function () {
        /* GET ALL USERS */
        this.router.get("/users", user_controller_1["default"].getAll);
        /* GET USER BY ID */
        this.router.get("/users/:id", user_controller_1["default"].getUserById);
        /* INSERT USER */
        this.router.post("/users", user_controller_1["default"].insertUser);
        /* UPDATE USER BY ID*/
        this.router.patch("/users/:id", user_controller_1["default"].updateUser);
        /* DELETE USER BY ID*/
        this.router["delete"]("/users/:id", user_controller_1["default"].deleteUser);
    };
    return UsersRoutes;
}());
exports.UsersRoutes = UsersRoutes;
var usersRoutes = new UsersRoutes();
usersRoutes.init();
exports["default"] = usersRoutes.router;
