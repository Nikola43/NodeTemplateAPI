"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../db/models/User");
class UsersController {
}
exports.default = UsersController;
UsersController.getAll = (req, res, next) => {
    res.status(200).send({ test: "test" });
};
UsersController.getUserById = async (req, res, next) => {
    res.status(200).send({ test: "test" });
};
UsersController.insertUser = async (req, res, next) => {
    const newUser = await User_1.User.create({
        name: 'Johnny',
        preferredName: 'John',
    });
    // console.log(newUser.id, newUser.name, newUser.preferredName);
    res.status(200).send({ test: "test" });
};
UsersController.updateUser = async (req, res, next) => {
    res.status(200).send({ test: "test" });
};
UsersController.deleteUser = async (req, res, next) => {
    res.status(200).send({ test: "test" });
};
//# sourceMappingURL=user_controller.js.map