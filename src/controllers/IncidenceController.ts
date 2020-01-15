import { Request, Response } from "express";
import { Incidence } from "../db/models/Incidence";
const Sequelize = require('sequelize');
const Op = Sequelize.Op


export default class IncidencesController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let incidencess = null;
        try {
            incidencess = await Incidence.findAll()
            if (incidencess) {
                res.status(200).send(incidencess);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static getIncidenceById = async (req: Request, res: Response, next: any) => {
        let incidences = null;
        try {
            const incidences = await Incidence.findByPk(req.query.id)
            if (incidences) {
                res.status(200).send(incidences);
            } else {
                res.status(200).send({ error: "incidences not found" });
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertIncidence = async (req: Request, res: Response, next: any) => {
        let newIncidence = null;
        try {
            const newIncidence = await Incidence.create({
                user_id: req.body.user_id,
                location_id: req.body.location_id,
                type_id: req.body.type_id,
                name: req.body.name,
                description: req.body.description,
                subtype: req.body.subtype,
                status: req.body.status,
                level: req.body.level,
                perimeter: req.body.perimeter,
                area: req.body.area,
                strategy: req.body.strategy,
                tactic: req.body.tactic,
                maneuver: req.body.maneuver,
                end_date: req.body.end_date
            });
            res.status(200).send(newIncidence);
        } catch (e) {
            res.status(500).send({ error: "Error insertando" });
        }
    };

    static updateIncidence = async (req: Request, res: Response, next: any) => {
        let incidences: Incidence = req.body;
        incidences.id = req.query.id;
        incidences.updated_at = new Date();
        try {
            incidences.update(incidences,
                {
                    where: {
                        id: {
                            [Op.eq]: incidences.id
                        },
                        deleted_at: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(incidences);
        } catch (e) {
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteIncidence = async (req: Request, res: Response, next: any) => {
        let incidences: Incidence = req.body;
        incidences.id = req.query.id;
        try {
            incidences.update({
                deleted_at: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: incidences.id
                        },
                        deleted_at: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Incidenceo eliminado" });
        } catch (e) {
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
