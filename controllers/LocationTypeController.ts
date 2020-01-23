import {Request, Response} from "express";
import {LocationTypeModel} from "../db/models/LocationTypeModel";
import Messages from "../messages/Messages";
import DeviceErrors from "../errors/DeviceErrors";
import {LOGUtil} from "../utils/LOGUtil";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


export default class LocationsTypesController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let locationTypes = null;
        try {
            locationTypes = await LocationTypeModel.findAll();
            if (locationTypes) {
                res.status(200).send(locationTypes);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("getAll location type - " + e.toString());
            res.status(500).send({error: "Error en la petición"});
        }
    };

    static getLocationTypeById = async (req: Request, res: Response, next: any) => {
        let locationTypes = null;
        try {
            const locationTypes = await LocationTypeModel.findByPk(req.params.id);
            if (locationTypes) {
                res.status(200).send(locationTypes);
            } else {
                res.status(200).send({error: "locations Types not found"});
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get Location Type By Id  - " + e.toString());
            res.status(500).send({error: "Error en la petición"});
        }
    };

    static insertLocationType = async (req: Request, res: Response, next: any) => {
        let newLocationTypes = null;
        try {
            const newLocationTypes = await LocationTypeModel.create({
                type: req.body.type
            });
            res.status(200).send(newLocationTypes);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert Location Type - " + e.toString());
            res.status(500).send({error: "Error insertando"});
        }
    };

    static updateLocationType = async (req: Request, res: Response, next: any) => {
        let locationTypes: LocationTypeModel = req.body;
        locationTypes.id = req.query.id;
        locationTypes.updatedAt = new Date();
        try {


            const updatedLocationTypes = await LocationTypeModel.update(locationTypes,
                {
                    where: {
                        id: {
                            [Op.eq]: locationTypes.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            // check if device are updated
            if (updatedLocationTypes[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(404).send(DeviceErrors.DEVICE_NOT_FOUND_ERROR);
            }
            res.status(200).send(locationTypes);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update location type - " + e.toString());
            res.status(500).send({error: "Error actualizando"});
        }
    };

    static deleteLocationType = async (req: Request, res: Response, next: any) => {
        let locationTypes: LocationTypeModel = req.body;
        locationTypes.id = req.query.id;
        try {
            locationTypes.update({
                    deletedAt: new Date()
                },
                {
                    where: {
                        id: {
                            [Op.eq]: locationTypes.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({success: "Tipo de localización eliminada"});
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete location type - " + e.toString());
            res.status(500).send({error: "Error eliminando"});
        }
    };
}
