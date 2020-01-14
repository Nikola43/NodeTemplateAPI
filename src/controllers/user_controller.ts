import {Request, Response} from "express";
import {User} from "../db/models/User";
import server from "../../server";

export default class UsersController {
    static getAll = (req: Request, res: Response, next: any) => {
        res.status(200).send({test: "test"});
    };

    static getUserById = async (req: Request, res: Response, next: any) => {
        res.status(200).send({test: "test"});
    };
    static insertUser = async (req: Request, res: Response, next: any) => {
        const newUser = await User.create({
            name: 'Johnny',
            preferredName: 'John',
        });
        // console.log(newUser.id, newUser.name, newUser.preferredName);
        res.status(200).send({test: "test"});
    };

    static updateUser = async (req: Request, res: Response, next: any) => {
        res.status(200).send({test: "test"});
    };

    static deleteUser = async (req: Request, res: Response, next: any) => {
        res.status(200).send({test: "test"});
        server.
    };
}
