"use strict";
exports.__esModule = true;
var IUser_1 = require("../models/IUser");
var UsersController = /** @class */ (function () {
    function UsersController() {
        this.getAll = function (req, res) {
            var users = IUser_1["default"].find(function (err, users) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(users);
                }
            });
        };
        this.getUserById = function (req, res) {
            var user = IUser_1["default"].findById(req.params.id, function (err, user) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(user);
                }
            });
        };
        this.insertUser = function (req, res) {
            var user = new IUser_1["default"](req.body);
            user.save(function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(user);
                }
            });
        };
        this.updateUser = function (req, res) {
            var user = IUser_1["default"].findByIdAndUpdate(req.params.id, req.body, function (err, user) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(user);
                }
            });
        };
        this.deleteUser = function (req, res) {
            var user = IUser_1["default"].deleteOne({ _id: req.params.id }, function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send("Iuser deleted from database");
                }
            });
        };
    }
    return UsersController;
}());
exports.UsersController = UsersController;
var usersController = new UsersController();
exports["default"] = usersController;
