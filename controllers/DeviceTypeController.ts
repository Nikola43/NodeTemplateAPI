import { Request, Response } from "express";
import { DeviceTypeModel } from "../db/models/DeviceTypeModel";
import {LOGUtil} from "../utils/LOGUtil";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

export default class DeviceTypesController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let deviceTypes = null;
        try {
            deviceTypes = await DeviceTypeModel.findAll();
            if (deviceTypes) {
                res.status(200).send(deviceTypes);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all device type - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static getDeviceTypeById = async (req: Request, res: Response, next: any) => {
        let deviceType = null;
        try {
            const deviceType = await DeviceTypeModel.findByPk(req.params.id);
            if (deviceType) {
                res.status(200).send(deviceType);
            } else {
                res.status(404).send({ error: "deviceType not found" });
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update location type - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertDeviceType = async (req: Request, res: Response, next: any) => {
        let newDeviceType = null;
        try {
            const newDeviceType = await DeviceTypeModel.create({
                type: req.body.type
            });
            res.status(200).send(newDeviceType);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update location type - " + e.toString());
            res.status(500).send({ error: "Error insertando" });
        }
    };

    static updateDeviceType = async (req: Request, res: Response, next: any) => {
        let deviceType: DeviceTypeModel = req.body;
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
            console.log(e);
            LOGUtil.saveLog("update device type - " + e.toString());
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteDeviceType = async (req: Request, res: Response, next: any) => {
        let deviceType: DeviceTypeModel = req.body;
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
            console.log(e);
            LOGUtil.saveLog("delete device type - " + e.toString());
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
