import { Request, Response } from "express";
import { LocationModel } from "../db/models/LocationModel";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


export default class LocationsController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let locations = null;
        try {
            locations = await LocationModel.findAll()
            if (locations) {
                res.status(200).send(locations);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static getLocationById = async (req: Request, res: Response, next: any) => {
        let locations = null;
        try {
            const locations = await LocationModel.findByPk(req.params.id);
            if (locations) {
                res.status(200).send(locations);
            } else {
                res.status(200).send({ error: "locations not found" });
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertLocation = async (req: Request, res: Response, next: any) => {
        let newLocation = null;
        try {
            const newLocation = await LocationModel.create({
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
            res.status(200).send(newLocation);
        } catch (e) {
            res.status(500).send({ error: "Error insertando" });
        }
    };

    static updateLocation = async (req: Request, res: Response, next: any) => {
        let locations: LocationModel = req.body;
        locations.id = req.query.id;
        locations.updatedAt = new Date();
        try {
            locations.update(locations,
                {
                    where: {
                        id: {
                            [Op.eq]: locations.id
                        },
                        deleted_at: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(locations);
        } catch (e) {
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteLocation = async (req: Request, res: Response, next: any) => {
        let locations: LocationModel = req.body;
        locations.id = req.query.id;
        try {
            locations.update({
                deleted_at: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: locations.id
                        },
                        deleted_at: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Locationo eliminado" });
        } catch (e) {
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
