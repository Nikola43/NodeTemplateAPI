import {Request, Response} from "express";
import {DeviceTypeModel} from "../db/models/DeviceTypeModel";
import {LOGUtil} from "../utils/LOGUtil";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class DeviceTypesController extends BaseController {
    getAll = async (req: Request, res: Response, next: Function) => {
        try {
            const deviceTypes = await DeviceTypeModel.findAll();
            deviceTypes ? res.status(200).send(deviceTypes) : res.status(200).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get all device type');
        }
    };

    getById = async (req: Request, res: Response, next: any) => {
        let deviceType = null;
        try {
            const deviceType = await DeviceTypeModel.findByPk(req.params.id);
            if (deviceType) {
                res.status(200).send(deviceType);
            } else {
                res.status(404).send({error: "deviceType not found"});
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update location type - " + e.toString());
            res.status(500).send({error: "Error en la petición"});
        }
    };

    insert = async (req: Request, res: Response, next: any) => {
        let newDeviceType = null;
        try {
            const newDeviceType = await DeviceTypeModel.create({
                type: req.body.type
            });
            res.status(200).send(newDeviceType);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update location type - " + e.toString());
            res.status(500).send({error: "Error insertando"});
        }
    };

    update = async (req: Request, res: Response, next: any) => {
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
            res.status(500).send({error: "Error actualizando"});
        }
    };

    delete = async (req: Request, res: Response, next: any) => {
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
            res.status(200).send({success: "Coordenada eliminada"});
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete device type - " + e.toString());
            res.status(500).send({error: "Error eliminando"});
        }
    };
}

const deviceTypesController = new DeviceTypesController();
export default deviceTypesController;
