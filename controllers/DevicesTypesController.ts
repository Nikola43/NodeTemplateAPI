import {Request, Response} from "express";
import {DeviceTypeModel} from "../db/models/DeviceTypeModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import Messages from "../constants/messages/Messages";
import DeviceTypeErrors from "../constants/errors/DeviceTypeErrors";
import server from "../server";


const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class DevicesTypesController extends BaseController {
    getAll = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await DeviceTypeModel.findAll();
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get all device type');
        }
    };

    getById = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await DeviceTypeModel.findByPk(req.params.id);
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.NOT_FOUND).send({error: "device type not found"});
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get device type by id');
        }
    };

    insert = async (req: Request, res: Response, next: Function) => {
        // get device from request
        const data: DeviceTypeModel = req.body;

        // check if type id are set
        if (!data.type) {
            res.status(HttpStatus.BAD_REQUEST).send(DeviceTypeErrors.DEVICE_TYPE_EMPTY);
            return;
        }

        try {
            const tempDevice = await DeviceTypeModel.findOne({
                attributes: [
                    'type',
                ], where: {
                    type: {
                        [Op.eq]: data.type
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // check if device already exist
            if (tempDevice) {
                res.status(HttpStatus.CONFLICT).send(DeviceTypeErrors.DEVICE_TYPE_ALREADY_EXIST_ERROR);
                return;
            } else {
                // Create device from request data
                const newData = await DeviceTypeModel.create(data);
                server.io.emit('DBEvent', {
                    modelName: 'DeviceTypeModel',
                    action: "insert",
                    data: newData
                });
                res.status(HttpStatus.CREATED).send(newData);
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, 'insert device type');
        }
    };

    update = async (req: Request, res: Response, next: Function) => {
        let data: DeviceTypeModel = req.body;
        data.id = Number(req.params.id);
        data.updatedAt = new Date();

        // update
        try {
            const updatedData = await DeviceTypeModel.update(data,
                {
                    where: {
                        id: {
                            [Op.eq]: data.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            if (updatedData[0] === 1) {
                server.io.emit('DBEvent', {
                    modelName: 'DeviceTypeModel',
                    action: "update",
                    data: Messages.SUCCESS_REQUEST_MESSAGE
                });
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send(DeviceTypeErrors.DEVICE_TYPE_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'update device type');
        }
    };

    delete = async (req: Request, res: Response, next: Function) => {
        // create model from request data
        const data: DeviceTypeModel = req.body;
        data.id = Number(req.params.id);
        data.deletedAt = new Date();

        // update
        try {
            const updatedData = await DeviceTypeModel.update(data,
                {
                    where: {
                        id: {
                            [Op.eq]: data.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            if (updatedData[0] === 1) {
                server.io.emit('DBEvent', {
                    modelName: 'DeviceTypeModel',
                    action: "delete",
                    data: data.id
                });
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send(DeviceTypeErrors.DEVICE_TYPE_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'deleted device type');
        }
    };
}

const devicesTypesController = new DevicesTypesController();
export default devicesTypesController;

