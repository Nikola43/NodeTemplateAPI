import { Request, Response } from "express";
import { IncidenceTypeModel } from "../db/models/IncidenceTypeModel";
import IncidenceTypeErrors from "../constants/errors/IncidenceTypeErrors";
import {ErrorUtil} from "../utils/ErrorUtil";
import Messages from "../constants/messages/Messages";
import BaseController from "./BaseController";


const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class IncidencesTypesController extends BaseController {
    getAll = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await IncidenceTypeModel.findAll();
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get all incidence type');
        }
    };

    getById = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await IncidenceTypeModel.findByPk(req.params.id);
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.NOT_FOUND).send({error: "incidence type not found"});
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get incidence type by id');
        }
    };

    insert = async (req: Request, res: Response, next: Function) => {
        // get center from request
        const data: IncidenceTypeModel = req.body;

        // check if type id are set
        if (!data.type) {
            res.status(HttpStatus.BAD_REQUEST).send(IncidenceTypeErrors.INCIDENCE_TYPE_ID_EMPTY_ERROR);
            return;
        }

        try {
            const tempCenter = await IncidenceTypeModel.findOne({
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

            // check if incidence already exist
            if (tempCenter) {
                res.status(HttpStatus.CONFLICT).send(IncidenceTypeErrors.INCIDENCE_TYPE_ALREADY_EXIST_ERROR);
                return;
            } else {
                // Create center from request data
                res.status(HttpStatus.CREATED).send(await IncidenceTypeModel.create(data))
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, 'insert incidence type');
        }
    };

    update = async (req: Request, res: Response, next: Function) => {
        let data: IncidenceTypeModel = req.body;
        data.id = Number(req.params.id);
        data.updatedAt = new Date();

        // update
        try {
            const updatedData = await IncidenceTypeModel.update(data,
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
                res.status(HttpStatus.NOT_FOUND).send(IncidenceTypeErrors.INCIDENCE_TYPE_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'update incidence type');
        }
    };

    delete = async (req: Request, res: Response, next: Function) => {
        // create model from request data
        const data: IncidenceTypeModel = req.body;
        data.id = Number(req.params.id);
        data.deletedAt = new Date();

        // update
        try {
            const updatedData = await IncidenceTypeModel.update(data,
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
                res.status(HttpStatus.NOT_FOUND).send(IncidenceTypeErrors.INCIDENCE_TYPE_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'deleted center type');
        }
    };
}
const incidencesTypesController = new IncidencesTypesController();
export default incidencesTypesController;
