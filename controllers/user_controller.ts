import {Request, Response} from "express";
import IUser from "../models/IUser";

export class UsersController {

    constructor() {

    }

    getAll = (req: Request, res: Response, next: any) => {
        res.status(200).send({test: "test"});
        const users = IUser.find((err: any, users: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(users);
            }
        });
    };


    getUserById = (req: Request, res: Response, next: any) => {
        const user = IUser.findById(req.params.id, (err: any, user: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(user);
            }
        });
    };
    insertUser = (req: Request, res: Response, next: any) => {
        const user = new IUser(req.body);
        user.save((err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(user);
            }
        });
    };

    updateUser = (req: Request, res: Response, next: any) => {
        const user = IUser.findByIdAndUpdate(
            req.params.id,
            req.body,
            (err: any, user: any) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(user);
                }
            }
        );
    };

    deleteUser = (req: Request, res: Response, next: any) => {
        const user = IUser.deleteOne({_id: req.params.id}, (err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Iuser deleted from database");
            }
        });
    };
}

let usersController = new UsersController();
export default usersController;
