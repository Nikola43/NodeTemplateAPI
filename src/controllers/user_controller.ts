import { Request, Response } from "express";
import { User } from "../db/models/User";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

export default class UsersController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let users = null;
        try {
            users = await User.findAll();
            if (users) {
                res.status(200).send(users);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static getUserById = async (req: Request, res: Response, next: any) => {
        let user = null;
        try {
            const user = await User.findByPk(req.query.id);
            if (user) {
                res.status(200).send(user);
            } else {
                res.status(200).send({ error: "user not found" });
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertUser = async (req: Request, res: Response, next: any) => {
        let newUser = null;
        try {
            const newUser = await User.create({
                name: req.body.name,
                preferredName: req.body.lastname
            });
            res.status(200).send(newUser);
        } catch (e) {
            res.status(500).send({ error: "Erro insertando" });
        }
    };

    static updateUser = async (req: Request, res: Response, next: any) => {
        let user: User = req.body;
        user.id = req.query.id;
        try {
            user.update(user,
                {
                    where: {
                        id: {
                            [Op.eq]: user.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(user);
        } catch (e) {
            res.status(500).send({ error: "Erro actualizando" });
        }
    };

    static deleteUser = async (req: Request, res: Response, next: any) => {
        let user: User = req.body;
        user.id = req.query.id;
        try {
            user.update({
                deletedAt: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: user.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(user);
        } catch (e) {
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
