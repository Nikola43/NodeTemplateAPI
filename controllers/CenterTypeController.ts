import { Request, Response } from "express";
import { CenterTypeModel } from "../db/models/CenterTypeModel";
import {LOGUtil} from "../utils/LOGUtil";
import {CenterModel} from "../db/models/CenterModel";
const Sequelize = require('sequelize');
const Op = Sequelize.Op


export default class CentersTypesController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let centers_type = null;
        try {
            centers_type = await CenterTypeModel.findAll()
            if (centers_type) {
                res.status(200).send(centers_type);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all center type - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static getCenterTypeById = async (req: Request, res: Response, next: any) => {
        let center_type = null;
        try {
            const center_type = await CenterTypeModel.findByPk(req.query.id)
            if (center_type) {
                res.status(200).send(center_type);
            } else {
                res.status(200).send({ error: "center_type not found" });
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get center type by ID - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertCenterType = async (req: Request, res: Response, next: any) => {
        //
        let centerType: CenterModel = req.body;
        try {
            const newCenterType = await CenterTypeModel.create(centerType);
            res.status(200).send(newCenterType);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert center Type- " + e.toString());
            res.status(500).send({ error: "Error insertando" });
        }
    };

    static updateCenterType = async (req: Request, res: Response, next: any) => {
        let center_type: CenterTypeModel = req.body;
        center_type.id = req.query.id;
        center_type.updatedAt = new Date();
        try {
            center_type.update(center_type,
                {
                    where: {
                        id: {
                            [Op.eq]: center_type.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(center_type);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update center type - " + e.toString());
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteCenterType = async (req: Request, res: Response, next: any) => {
        let center_type: CenterTypeModel = req.body;
        center_type.id = req.query.id;
        try {
            center_type.update({
                deletedAt: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: center_type.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Tipo de centro eliminado" });
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete center type - " + e.toString());
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
