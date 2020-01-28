import {Request, Response} from "express";
import {LocationTypeModel} from "../db/models/LocationTypeModel";
import Messages from "../constants/messages/Messages";
import LocationTypeErrors from "../constants/errors/LocationTypeErrors";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import CenterTypeErrors from "../constants/errors/CenterTypeErrors";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class LocationsTypesController extends BaseController {
    getAll = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await LocationTypeModel.findAll();
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get all location type');
        }
    };

    getById = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await LocationTypeModel.findByPk(req.params.id);
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.NOT_FOUND).send({error: "location type not found"});
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get location type by id');
        }
    };

    insert = async (req: Request, res: Response, next: Function) => {
        // get location from request
        const data: LocationTypeModel = req.body;

        // check if type id are set
        if (!data.type) {
            res.status(HttpStatus.BAD_REQUEST).send(CenterTypeErrors.CENTER_TYPE_ID_EMPTY_ERROR);
            return;
        }

        try {
            const tempCenter = await LocationTypeModel.findOne({
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
                res.status(HttpStatus.CONFLICT).send(LocationTypeErrors.LOCATION_TYPE_ALREADY_EXIST_ERROR);
                return;
            } else {
                // Create location from request data
                res.status(HttpStatus.CREATED).send(await LocationTypeModel.create(data))
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, 'insert location type');
        }
    };

    update = async (req: Request, res: Response, next: Function) => {
        let data: LocationTypeModel = req.body;
        data.id = Number(req.params.id);
        data.updatedAt = new Date();

        // update
        try {
            const updatedData = await LocationTypeModel.update(data,
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
                res.status(HttpStatus.NOT_FOUND).send(LocationTypeErrors.LOCATION_TYPE_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'update location type');
        }
    };

    delete = async (req: Request, res: Response, next: Function) => {
        // create model from request data
        const data: LocationTypeModel = req.body;
        data.id = Number(req.params.id);
        data.deletedAt = new Date();

        // update
        try {
            const updatedData = await LocationTypeModel.update(data,
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
                res.status(HttpStatus.NOT_FOUND).send(LocationTypeErrors.LOCATION_TYPE_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'deleted location type');
        }
    };
}
const locationsTypesController = new LocationsTypesController();
export default locationsTypesController;
