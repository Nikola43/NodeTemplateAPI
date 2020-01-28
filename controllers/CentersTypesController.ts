import {Request, Response} from "express";
import {CenterTypeModel} from "../db/models/CenterTypeModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import Messages from "../constants/messages/Messages";
import CenterTypeErrors from "../constants/errors/CenterTypeErrors";
import server from "../server";
import GenericErrors from "../constants/errors/GenericErrors";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class CentersTypesController extends BaseController {

    constructor() {
        super();
        this.className = CentersTypesController.name;
    }

    // functions
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await CenterTypeModel.findAll({
                where: {
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // if has results, then send result data
            // if not has result, send empty array
            queryResult
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, this.className + ' - getAll');
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await CenterTypeModel.findByPk(req.params.id);

            // if has results, then send result data
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: CenterTypeModel.className + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, this.className + ' - getById');
        }
    };

    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: CenterTypeModel = req.body;
        let tempData: any;

        // check if field called 'type' are set
        // if field not are set, then send empty required field error
        if (!data.type) {
            res.status(HttpStatus.BAD_REQUEST).send({error: CenterTypeModel.name + " " + GenericErrors.TYPE_EMPTY_ERROR});
            return;
        }

        // check if field callet 'temporary' are set
        // if field not are set, then send empty required field error
        if (!data.temporary) {
            res.status(HttpStatus.BAD_REQUEST).send({error: CenterTypeModel.name + " " + CenterTypeErrors.CENTER_TYPE_TEMPORARY_EMPTY_ERROR});
            return;
        }

        // find if exists any record with same request value in type field
        try {
            tempData = await CenterTypeModel.findOne({
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

            // if already exist
            // send conflict error
            if (tempData) {
                res.status(HttpStatus.CONFLICT).send({error: CenterTypeModel.name + " " + GenericErrors.ALREADY_EXIST_ERROR});
                return;
            } else {
                // create new record from request body data
                const newData = await CenterTypeModel.create(data);

                // emit new data
                server.io.emit('DBEvent', {
                    modelName: CenterTypeModel.name,
                    action: 'Insert' + CenterTypeModel.name,
                    data: newData
                });

                // respond request
                res.status(HttpStatus.CREATED).send(newData)
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, this.className + ' - insert');
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: CenterTypeModel = req.body;

        // get record id(pk) from request params
        data.id = Number(req.params.id);

        // set updated date
        data.updatedAt = new Date();

        // update
        try {
            const updateResult = await CenterTypeModel.update(data,
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

            // if it has affected one row
            if (updateResult[0] === 1) {

                // find updated data
                const updatedData = await CenterTypeModel.findByPk(data.id);

                // emit updated data
                server.io.emit('DBEvent', {
                    modelName: CenterTypeModel.name,
                    action: 'Update' + CenterTypeModel.name,
                    data: updatedData
                });

                // respond request
                res.status(HttpStatus.OK).send(updatedData);

            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: CenterTypeModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, this.className + ' - update')
        }
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: CenterTypeModel = req.body;

        // get record id(pk) from request params
        data.id = Number(req.params.id);

        // set deleted date
        data.deletedAt = new Date();

        // delete
        try {
            const deleteResult = await CenterTypeModel.update(data,
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

            // if it has affected one row
            if (deleteResult[0] === 1) {
                // emit updated data
                server.io.emit('DBEvent', {
                    modelName: CenterTypeModel.name,
                    action: 'Delete' + CenterTypeModel.name,
                    data: data.id
                });

                // respond request
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: CenterTypeModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, this.className + ' - delete')
        }
    };
}

const centersTypesController = new CentersTypesController();
export default centersTypesController;
