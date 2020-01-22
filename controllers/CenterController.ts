import { Request, Response } from "express";
import { CenterModel } from "../db/models/CenterModel";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


export default class CentersController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let centers = null;
        try {
            centers = await CenterModel.findAll();
            if (centers) {
                res.status(200).send(centers);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static getCenterById = async (req: Request, res: Response, next: any) => {
        let center = null;
        try {
            const center = await CenterModel.findByPk(req.params.id);
            if (center) {
                res.status(200).send(center);
            } else {
                res.status(200).send({ error: "center not found" });
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertCenter = async (req: Request, res: Response, next: any) => {
        let newCenter = null;
        try {
            const newCenter = await CenterModel.create({
                location_id: req.body.location_id,
                type_id: req.body.type_id,
                name: req.body.name,
                description: req.body.description,
                phone: req.body.phone,
                email: req.body.email,
                leader: req.body.leader,
                schedule: req.body.schedule,
                end_at: req.body.end_at
            });
            res.status(200).send(newCenter);
        } catch (e) {
            res.status(500).send({ error: "Error insertando" });
        }
    };

    static updateCenter = async (req: Request, res: Response, next: any) => {
        let center: CenterModel = req.body;
        center.id = req.query.id;
        center.updatedAt = new Date();
        try {
            center.update(center,
                {
                    where: {
                        id: {
                            [Op.eq]: center.id
                        },
                        deleted_at: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(center);
        } catch (e) {
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteCenter = async (req: Request, res: Response, next: any) => {
        let center: CenterModel = req.body;
        center.id = req.query.id;
        try {
            center.update({
                deleted_at: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: center.id
                        },
                        deleted_at: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Centro eliminado" });
        } catch (e) {
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
