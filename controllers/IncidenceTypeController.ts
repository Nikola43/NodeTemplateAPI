import { Request, Response } from "express";
import { IncidenceTypeModel } from "../db/models/IncidenceTypeModel";
import {LOGUtil} from "../utils/LOGUtil";
const Sequelize = require('sequelize');
const Op = Sequelize.Op


export default class IncidencesTypesController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let incidencesTypess = null;
        try {
            incidencesTypess = await IncidenceTypeModel.findAll()
            if (incidencesTypess) {
                res.status(200).send(incidencesTypess);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all incidence type - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static getIncidenceTypeById = async (req: Request, res: Response, next: any) => {
        let incidencesTypes = null;
        try {
            const incidencesTypes = await IncidenceTypeModel.findByPk(req.query.id)
            if (incidencesTypes) {
                res.status(200).send(incidencesTypes);
            } else {
                res.status(200).send({ error: "incidencesTypes not found" });
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get incidence type by ID - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertIncidenceType = async (req: Request, res: Response, next: any) => {
        //
        let incidenceType: IncidenceTypeModel = req.body;
        try {
            const newIncidenceTypes = await IncidenceTypeModel.create(incidenceType);
            res.status(200).send(newIncidenceTypes);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert incidence type - " + e.toString());
            res.status(500).send({ error: "Error insertando" });
        }
    };

    static updateIncidenceType = async (req: Request, res: Response, next: any) => {
        let incidencesTypes: IncidenceTypeModel = req.body;
        incidencesTypes.id = req.query.id;
        incidencesTypes.updatedAt = new Date();
        try {
            incidencesTypes.update(incidencesTypes,
                {
                    where: {
                        id: {
                            [Op.eq]: incidencesTypes.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(incidencesTypes);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update incidence type - " + e.toString());
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteIncidenceType = async (req: Request, res: Response, next: any) => {
        let incidencesTypes: IncidenceTypeModel = req.body;
        incidencesTypes.id = req.query.id;
        try {
            incidencesTypes.update({
                deletedAt: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: incidencesTypes.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Tipo de incidencia eliminada" });
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete incidence type - " + e.toString());
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
