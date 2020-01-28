import {Request, Response} from "express";
import {CenterModel} from "../db/models/CenterModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import CenterErrors from "../constants/errors/CenterErrors";
import {CenterTypeModel} from "../db/models/CenterTypeModel";
import Messages from "../constants/messages/Messages";
import server from "../server";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class CentersController extends BaseController {
    getAll = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await CenterTypeModel.findAll();
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get all centers');
        }
    };

    getById = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await CenterModel.findByPk(req.params.id);
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.NOT_FOUND).send(CenterErrors.CENTER_NOT_FOUND_ERROR);
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get center by id');
        }
    };

    insert = async (req: Request, res: Response, next: Function) => {
        // get center from request
        const data: CenterModel = req.body;

        // check if type id are set
        if (!data.type_id) {
            res.status(HttpStatus.BAD_REQUEST).send(CenterErrors.CENTER_TYPE_ID_EMPTY_ERROR);
            return;
        }

        // check if name are set
        if (!data.name) {
            res.status(HttpStatus.BAD_REQUEST).send(CenterErrors.CENTER_NAME_EMPTY_ERROR);
            return;
        }

        try {
            const tempCenter = await CenterModel.findOne({
                attributes: [
                    'name',
                ], where: {
                    name: {
                        [Op.eq]: data.name
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });



            // check if device already exist
            if (tempCenter) {
                res.status(HttpStatus.CONFLICT).send(CenterErrors.CENTER_ALREADY_EXIST_ERROR);
                return;
            } else {
                // Create center from request data
                const newData = await CenterModel.create(data);

                // emit new data
                server.io.emit('DBEvent', {
                    modelName: 'CenterModel',
                    action: "insert",
                    data: newData
                });

                // respond request
                res.status(HttpStatus.CREATED).send(newData)
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, 'insert center');
        }
    };

    update = async (req: Request, res: Response, next: Function) => {
        // create model from request data
        const data: CenterModel = req.body;
        data.id = Number(req.params.id);
        data.updatedAt = new Date();

        // update
        try {
            const updatedData = await CenterModel.update(data,
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
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send(CenterErrors.CENTER_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'update center');
        }
    };

    delete = async (req: Request, res: Response, next: Function) => {
        // create model from request data
        const data: CenterModel = req.body;
        data.id = Number(req.params.id);
        data.deletedAt = new Date();

        // update
        try {
            const updatedData = await CenterModel.update(data,
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
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send(CenterErrors.CENTER_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'deleted center');
        }
    };
}

const centersController = new CentersController();
export default centersController;
