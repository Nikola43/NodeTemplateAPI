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
                center_id: req.body.center_id,
                username: req.body.username,
                password: req.body.password,
                name: req.body.name,
                lastname: req.body.lastname,
                status: req.body.status,
                rank: req.body.rank,
                role: req.body.role,
                email: req.body.email,
                phone: req.body.phone,
                available: req.body.available,
                gender: req.body.gender,
                age: req.body.age,
                weight: req.body.weight,
                height: req.body.height,
                blood_type: req.body.blood_type,
                pulsations_max_rest: req.body.pulsations_max_rest,
                vo2_max: req.body.vo2_max
            });
            res.status(200).send(newUser);
        } catch (e) {
            res.status(500).send({ error: "Error insertando" });
        }
    };

    static updateUser = async (req: Request, res: Response, next: any) => {
        let user: User = req.body;
        user.id = req.query.id;
        user.updatedAt = new Date();
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
            res.status(500).send({ error: "Error actualizando" });
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
            res.status(200).send({ success: "Usuario eliminado" });
        } catch (e) {
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
