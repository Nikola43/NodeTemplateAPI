import { Request, Response } from "express";
import { CoordinateModel } from "../db/models/CoordinateModel";
import {LOGUtil} from "../utils/LOGUtil";
import {CenterModel} from "../db/models/CenterModel";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

export default class CoordinatesController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let coordinates = null;
        try {
            coordinates = await CoordinateModel.findAll();
            if (coordinates) {
                res.status(200).send(coordinates);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all coordinate - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static getCoordinateById = async (req: Request, res: Response, next: any) => {
        let coordinate = null;
        try {
            const coordinate = await CoordinateModel.findByPk(req.query.id)
            if (coordinate) {
                res.status(200).send(coordinate);
            } else {
                res.status(200).send({ error: "coordinate not found" });
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get coordinate by ID - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertCoordinate = async (req: Request, res: Response, next: any) => {
        let coordinate: CoordinateModel = req.body;
        try {
            const newCoordinate = await CoordinateModel.create(coordinate);
            res.status(200).send(newCoordinate);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert coordinate - " + e.toString());
            res.status(500).send({ error: "Error insertando" });
        }
    };

    static updateCoordinate = async (req: Request, res: Response, next: any) => {
        let coordinate: CoordinateModel = req.body;
        coordinate.id = req.query.id;
        coordinate.updatedAt = new Date();
        try {
            coordinate.update(coordinate,
                {
                    where: {
                        id: {
                            [Op.eq]: coordinate.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(coordinate);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update coordinate - " + e.toString());
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteCoordinate = async (req: Request, res: Response, next: any) => {
        let coordinate: CoordinateModel = req.body;
        coordinate.id = req.query.id;
        try {
            coordinate.update({
                deletedAt: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: coordinate.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Coordenada eliminada" });
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete coordinate - " + e.toString());
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
