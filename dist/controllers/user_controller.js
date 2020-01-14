"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IUser_1 = __importDefault(require("../models/IUser"));
class UsersController {
    constructor() {
        this.getAll = (req, res, next) => {
            res.status(200).send({ test: "test" });
            const users = IUser_1.default.find((err, users) => {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(users);
                }
            });
        };
        this.getUserById = (req, res, next) => {
            const user = IUser_1.default.findById(req.params.id, (err, user) => {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(user);
                }
            });
        };
        this.insertUser = (req, res, next) => {
            const user = new IUser_1.default(req.body);
            user.save((err) => {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(user);
                }
            });
        };
        this.updateUser = (req, res, next) => {
            const user = IUser_1.default.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(user);
                }
            });
        };
        this.deleteUser = (req, res, next) => {
            const user = IUser_1.default.deleteOne({ _id: req.params.id }, (err) => {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send("Iuser deleted from database");
                }
            });
        };
    }
}
exports.UsersController = UsersController;
let usersController = new UsersController();
exports.default = usersController;
//# sourceMappingURL=user_controller.js.map