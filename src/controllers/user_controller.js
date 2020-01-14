"use strict";
exports.__esModule = true;
var IUser_1 = require("../db/models/IUser");
var UsersController = /** @class */ (function () {
    function UsersController() {
        this.getAll = function (req, res, next) {
            res.status(200).send({ test: "test" });
        };
        this.getUserById = function (req, res, next) {
            res.status(200).send({ test: "test" });
        };
        this.insertUser = function (req, res, next) {
            var newUser = IUser_1.User.create({
                name: 'Johnny',
                preferredName: 'John'
            });
            // console.log(newUser.id, newUser.name, newUser.preferredName);
            res.status(200).send({ test: "test" });
        };
        this.updateUser = function (req, res, next) {
            res.status(200).send({ test: "test" });
        };
        this.deleteUser = function (req, res, next) {
            res.status(200).send({ test: "test" });
        };
    }
    return UsersController;
}());
exports.UsersController = UsersController;
var usersController = new UsersController();
exports["default"] = usersController;
