import { Request, Response } from "express";
import { CenterModel } from "../db/models/CenterModel";
import {LOGUtil} from "../utils/LOGUtil";

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
            console.log(e);
            LOGUtil.saveLog("get all center - " + e.toString());
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
            console.log(e);
            LOGUtil.saveLog("get center by ID - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertCenter = async (req: Request, res: Response, next: any) => {
        //
        let center: CenterModel = req.body;
        try {
            const newCenter = await CenterModel.create(center);
            res.status(200).send(newCenter);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert center - " + e.toString());
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
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(center);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update center - " + e.toString());
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteCenter = async (req: Request, res: Response, next: any) => {
        let center: CenterModel = req.body;
        center.id = req.query.id;
        try {
            center.update({
                deletedAt: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: center.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Centro eliminado" });
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete center - " + e.toString());
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
