import {Request, Response} from "express";
import {Device} from "../db/models/Device";
import ServerErrors from "../errors/ServerErrors";
import Messages from "../messages/Messages";
import DeviceErrors from "../errors/DeviceErrors";
import {User} from "../db/models/User";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

export default class DeviceController {
    static getAll = async (req: Request, res: Response, next: any) => {
        try {
            const devices = await Device.findAll();
            res.status(200).send(devices);
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    static getDeviceById = async (req: Request, res: Response, next: any) => {
        try {
            const device = await Device.findByPk(req.params.id);

            if (device) {
                res.status(200).send(device);
            } else {
                res.status(404).send(DeviceErrors.DEVICE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send({error: "internal error"});
        }
    };

    static insertDevice = async (req: Request, res: Response, next: any) => {

        // get deviceID from request
        let device: Device = req.body;

        // check if deviceID are set
        // if not are set, break execution
        if (!device.type_id) {
            res.status(400).send(DeviceErrors.DEVICE_TYPEID_EMPTY_ERROR);
            return;
        }

        if (!device.name) {
            res.status(400).send(DeviceErrors.DEVICE_NAME_EMPTY_ERROR);
            return;
        }

        // find device in db for check if already exists
        try {
            const tempDevice = await Device.findOne({
                attributes: [
                    'name','type_id'
                ], where: {
                    type_id: {
                        [Op.is]: null
                    },
                    name: {
                        [Op.eq]: device.name
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // check if device already exist
            // break execution
            if (tempDevice) {
                res.status(400).send(DeviceErrors.DEVICE_ALREADY_EXIST_ERROR);
                return;
            } else {
                try {
                    // Create user from request data
                    const newDevice = await Device.create(device);

                    res.status(200).send(newDevice);
                } catch (e) {
                    console.log(e);
                    res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    static updateDevice = async (req: Request, res: Response, next: any) => {
        // get deviceID from request
        const deviceId = req.params.id;


        // check if deviceId are set
        // if not are set, break execution
        if (!deviceId) {
            res.status(400).send(DeviceErrors.DEVICE_TYPEID_EMPTY_ERROR);
            return;
        }

        try {
            // created device from request data
            let device: Device = req.body;
            device.updatedAt = new Date();

            const updatedDevice = await Device.update(device,
                {
                    where: {
                        id: {
                            [Op.eq]: deviceId
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });

            // check if device are updated
            if (updatedDevice[0] === 1) {
               res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
               //res.status(200).send(updatedDevice);

            } else {
                res.status(404).send(DeviceErrors.DEVICE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    static deleteDevice = async (req: Request, res: Response, next: any) => {
        // get userID from request
        const deviceId = req.params.id;

        // check if deviceId are set
        // if not are set, break execution
        if (!deviceId) {
            res.status(400).send(DeviceErrors.DEVICE_TYPEID_EMPTY_ERROR);
            return;
        }

        try {
            const device = await Device.update({deletedAt: new Date()},
                {
                    where: {
                        id: {
                            [Op.eq]: deviceId
                        },
                        deletedAt: {
                            [Op.eq]: null
                        }
                    }
                });

            // check if device are deleted
            if (device[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(404).send(DeviceErrors.DEVICE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };
}
