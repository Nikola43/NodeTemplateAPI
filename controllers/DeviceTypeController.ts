import { Request, Response } from "express";
import { DeviceType } from "../db/models/DeviceType";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

export default class DeviceTypesController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let deviceTypes = null;
        try {
            deviceTypes = await DeviceType.findAll();
            if (deviceTypes) {
                res.status(200).send(deviceTypes);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static getDeviceTypeById = async (req: Request, res: Response, next: any) => {
        let deviceType = null;
        try {
            const deviceType = await DeviceType.findByPk(req.query.id)
            if (deviceType) {
                res.status(200).send(deviceType);
            } else {
                res.status(200).send({ error: "deviceType not found" });
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertDeviceType = async (req: Request, res: Response, next: any) => {
        let newDeviceType = null;
        try {
            const newDeviceType = await DeviceType.create({
                type: req.body.type
            });
            res.status(200).send(newDeviceType);
        } catch (e) {
            res.status(500).send({ error: "Error insertando" });
        }
    };

    static updateDeviceType = async (req: Request, res: Response, next: any) => {
        let deviceType: DeviceType = req.body;
        deviceType.id = req.query.id;
        deviceType.updatedAt = new Date();
        try {
            deviceType.update(deviceType,
                {
                    where: {
                        id: {
                            [Op.eq]: deviceType.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(deviceType);
        } catch (e) {
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteDeviceType = async (req: Request, res: Response, next: any) => {
        let deviceType: DeviceType = req.body;
        deviceType.id = req.query.id;
        try {
            deviceType.update({
                deletedAt: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: deviceType.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Coordenada eliminada" });
        } catch (e) {
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
