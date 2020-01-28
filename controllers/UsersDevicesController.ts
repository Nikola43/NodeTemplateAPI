import {Request, Response} from "express";
import UserDeviceErrors from "../constants/errors/UserErrors";
import {UserDeviceModel} from "../db/models/UserDeviceModel";
import ServerErrors from "../constants/errors/ServerErrors";
import Messages from "../constants/messages/Messages";
import {LOGUtil} from "../utils/LOGUtil";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class UsersDevicesController {
    getAll = async (req: Request, res: Response, next: any) => {
        try {
            const userDevice = await UserDeviceModel.findAll();
            res.status(200).send(userDevice);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all user device - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    getById = async (req: Request, res: Response, next: any) => {
        try {
            const userDevice = await UserDeviceModel.findByPk(req.params.id);
            console.log(req.params.id);

            if (userDevice) {
                res.status(200).send(userDevice);
            } else {
                res.status(404).send(UserDeviceErrors.USER_DEVICE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get user device by id - " + e.toString());
            res.status(500).send({error: "internal error"});
        }
    };

    insert = async (req: Request, res: Response, next: any) => {

        // get userDevice data from request
        const userId = req.body.user_id;
        const deviceId = req.body.device_id;

        // check if centerID are set
        // if not are set, break execution
        if (!userId) {
            res.status(400).send(UserDeviceErrors.USER_ID_EMPTY_ERROR);
            return;
        }

        if (!deviceId) {
            res.status(400).send(UserDeviceErrors.DEVICE_ID_EMPTY_ERROR);
            return;
        }

        // find userDevice in db for check if already exists
        try {
            const tempResource = await UserDeviceModel.findOne({
                attributes: [
                    'device_id',
                ], where: {
                    device_id: {
                        [Op.eq]: deviceId
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // check if userDevice already have center
            // break execution
            if (tempResource) {
                res.status(400).send(UserDeviceErrors.USER_DEVICE_ALREADY_EXIST_ERROR);
                return;
            } else {

                const newUserDeviceData: UserDeviceModel = req.body;

                try {
                    // Create userDevice from request data
                    const newUserDevice = await UserDeviceModel.create(newUserDeviceData);

                    res.status(200).send(newUserDevice);
                } catch (e) {
                    console.log(e);
                    LOGUtil.saveLog("insert user device - " + e.toString());
                    res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert user device - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    update = async (req: Request, res: Response, next: any) => {
        // get userDeviceID from request
        const userDeviceId = req.params.id;

        // check if resourceId are set
        // if not are set, break execution
        if (!userDeviceId) {
            res.status(400).send(UserDeviceErrors.USER_DEVICE_ID_EMPTY_ERROR);
            return;
        }

        try {
            // create userDevice from request data
            let userDevice: UserDeviceModel = req.body;
            userDevice.updatedAt = new Date();

            const updatedUserDevice = await UserDeviceModel.update(userDevice,
                {
                    where: {
                        id: {
                            [Op.eq]: userDeviceId
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });

            // check if userDevice are updated
            if (updatedUserDevice[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
                //res.status(200).send(updatedUserDevice);

            } else {
                res.status(404).send(UserDeviceErrors.USER_DEVICE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update user device - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    delete = async (req: Request, res: Response, next: any) => {
        // get userDeviceID from request
        const userDeviceId = req.params.id;

        // check if resourceId are set
        // if not are set, break execution
        if (!userDeviceId) {
            res.status(400).send(UserDeviceErrors.USER_DEVICE_ID_EMPTY_ERROR);
            return;
        }

        try {
            const userDevice = await UserDeviceModel.update({deletedAt: new Date()},
                {
                    where: {
                        id: {
                            [Op.eq]: userDeviceId
                        },
                        deletedAt: {
                            [Op.eq]: null
                        }
                    }
                });

            // check if userDevice are deleted
            if (userDevice[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(404).send(UserDeviceErrors.USER_DEVICE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete user device - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };
}
