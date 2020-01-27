import {Request, Response} from "express";
import {CenterTypeModel} from "../db/models/CenterTypeModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import Messages from "../messages/Messages";
import CenterTypeErrors from "../errors/CenterTypeErrors";


const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class CentersTypesController extends BaseController {
    getAll = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await CenterTypeModel.findAll();
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get all center type');
        }
    };

    getById = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await CenterTypeModel.findByPk(req.params.id);
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.NOT_FOUND).send({error: "center type not found"});
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get device type by id');
        }
    };

    insert = async (req: Request, res: Response, next: Function) => {
        // get center from request
        const data: CenterTypeModel = req.body;

        // check if type id are set
        if (!data.type) {
            res.status(HttpStatus.BAD_REQUEST).send(CenterTypeErrors.CENTER_TYPE_ID_EMPTY_ERROR);
            return;
        }

        // check if name are set
        if (!data.temporary) {
            res.status(HttpStatus.BAD_REQUEST).send(CenterTypeErrors.CENTER_TYPE_TEMPORARY_EMPTY_ERROR);
            return;
        }

        try {
            const tempCenter = await CenterTypeModel.findOne({
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
            if (tempCenter) {
                res.status(HttpStatus.CONFLICT).send(CenterTypeErrors.CENTER_TYPE_ALREADY_EXIST_ERROR);
                return;
            } else {
                // Create center from request data
                res.status(HttpStatus.CREATED).send(await CenterTypeModel.create(data))
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, 'insert center type');
        }
    };

    update = async (req: Request, res: Response, next: Function) => {
        let data: CenterTypeModel = req.body;
        data.id = Number(req.params.id);
        data.updatedAt = new Date();

        // update
        try {
            const updatedData = await CenterTypeModel.update(data,
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
                res.status(HttpStatus.NOT_FOUND).send(CenterTypeErrors.CENTER_TYPE_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'update center type');
        }
    };

    delete = async (req: Request, res: Response, next: Function) => {
        // create model from request data
        const data: CenterTypeModel = req.body;
        data.id = Number(req.params.id);
        data.deletedAt = new Date();

        // update
        try {
            const updatedData = await CenterTypeModel.update(data,
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
                res.status(HttpStatus.NOT_FOUND).send(CenterTypeErrors.CENTER_TYPE_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'deleted center type');
        }
    };
}

const centersTypesController = new CentersTypesController();
export default centersTypesController;
