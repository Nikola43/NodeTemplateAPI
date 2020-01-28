import {Request, Response} from "express";
import {DeviceModel} from "../db/models/DeviceModel";
import ServerErrors from "../constants/errors/ServerErrors";
import Messages from "../constants/messages/Messages";
import DeviceErrors from "../constants/errors/DeviceErrors";
import {UserModel} from "../db/models/UserModel";
import {LOGUtil} from "../utils/LOGUtil";
import BaseController from "./BaseController";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class DevicesController extends BaseController {
     getAll = async (req: Request, res: Response, next: Function) => {
        try {
            res.status(200).send(await DeviceModel.findAll());
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all device - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

     getById = async (req: Request, res: Response, next: Function) => {
        try {
            const device = await DeviceModel.findByPk(req.params.id);

            if (device) {
                res.status(200).send(device);
            } else {
                res.status(404).send(DeviceErrors.DEVICE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get device by ID - " + e.toString());
            res.status(500).send({error: "internal error"});
        }
    };

     insert = async (req: Request, res: Response, next: Function) => {
        // get device from request
        let device: DeviceModel = req.body;

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
            const tempDevice = await DeviceModel.findOne({
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
                    const newDevice = await DeviceModel.create(device);

                    res.status(200).send(newDevice);
                } catch (e) {
                    console.log(e);
                    LOGUtil.saveLog("insert device - " + e.toString());
                    res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert device - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

     update = async (req: Request, res: Response, next: Function) => {
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
            let device: DeviceModel = req.body;
            device.updatedAt = new Date();

            const updatedDevice = await DeviceModel.update(device,
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
            } else {
                res.status(404).send(DeviceErrors.DEVICE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update device  - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

     delete = async (req: Request, res: Response, next: Function) => {
        // get userID from request
        const deviceId = req.params.id;

        // check if deviceId are set
        // if not are set, break execution
        if (!deviceId) {
            res.status(400).send(DeviceErrors.DEVICE_TYPEID_EMPTY_ERROR);
            return;
        }

        try {
            const device = await DeviceModel.update({deletedAt: new Date()},
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
            LOGUtil.saveLog("Delete device - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };
}

const deviceController = new DevicesController();
export default deviceController;
