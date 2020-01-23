import { Request, Response } from "express";
import { LocationModel } from "../db/models/LocationModel";
import {LOGUtil} from "../utils/LOGUtil";
import {CenterModel} from "../db/models/CenterModel";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


export default class LocationsController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let locations = null;
        try {
            locations = await LocationModel.findAll();
            if (locations) {
                res.status(200).send(locations);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all location - " + e.toString());
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
            console.log(e);
            LOGUtil.saveLog("get location by ID - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertLocation = async (req: Request, res: Response, next: any) => {
        //
        let location: LocationModel = req.body;
        try {
            const newLocation = await LocationModel.create(location);
            res.status(200).send(newLocation);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert location - " + e.toString());
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
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(locations);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update location - " + e.toString());
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteLocation = async (req: Request, res: Response, next: any) => {
        let locations: LocationModel = req.body;
        locations.id = req.query.id;
        try {
            locations.update({
                deletedAt: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: locations.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Locationo eliminado" });
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete location - " + e.toString());
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
