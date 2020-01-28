import {Request, Response} from "express";
import {IncidenceTypeModel} from "../../db/models/typesModels/IncidenceTypeModel";
import BaseController from "../BaseController";
import {ErrorUtil} from "../../utils/ErrorUtil";
import Messages from "../../constants/messages/Messages";
import server from "../../server";
import GenericErrors from "../../constants/errors/GenericErrors";
import DBActions from "../../constants/DBActions";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class IncidencesTypesController extends BaseController {
    // functions
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await IncidenceTypeModel.findAll({
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
            ErrorUtil.handleError(res, e, IncidencesTypesController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await IncidenceTypeModel.findByPk(req.params.id);

            // if has results, then send result data
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: IncidenceTypeModel.className + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, IncidencesTypesController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: IncidenceTypeModel = req.body;
        let tempData: any;

        // check if field called 'type' are set
        // if field not are set, then send empty required field error
        if (!data.type) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceTypeModel.name + " " + GenericErrors.TYPE_EMPTY_ERROR});
            return;
        }

        // find if exists any record with same request value in type field
        try {
            tempData = await IncidenceTypeModel.findOne({
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
                res.status(HttpStatus.CONFLICT).send({error: IncidenceTypeModel.name + " " + GenericErrors.ALREADY_EXIST_ERROR});
                return;
            } else {
                // create new record from request body data
                const newData = await IncidenceTypeModel.create(data);

                // emit new data
                server.io.emit('DBEvent', {
                    modelName: IncidenceTypeModel.name,
                    action: DBActions.INSERT + IncidenceTypeModel.name,
                    data: newData
                });

                // respond request
                res.status(HttpStatus.CREATED).send(newData)
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, IncidencesTypesController.name + ' - ' + DBActions.INSERT);
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: IncidenceTypeModel = req.body;

        // get record id(pk) from request params
        data.id = Number(req.params.id);

        // set updated date
        data.updatedAt = new Date();

        // update
        try {
            const updateResult = await IncidenceTypeModel.update(data,
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
                const updatedData = await IncidenceTypeModel.findByPk(data.id);

                // emit updated data
                server.io.emit('DBEvent', {
                    modelName: IncidenceTypeModel.name,
                    action: DBActions.UPDATE + IncidenceTypeModel.name,
                    data: updatedData
                });

                // respond request
                res.status(HttpStatus.OK).send(updatedData);

            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: IncidenceTypeModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, IncidencesTypesController.name + ' - ' + DBActions.UPDATE);
        }
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: IncidenceTypeModel = req.body;

        // get record id(pk) from request params
        data.id = Number(req.params.id);

        // set deleted date
        data.deletedAt = new Date();

        // delete
        try {
            const deleteResult = await IncidenceTypeModel.update(data,
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
                    modelName: IncidenceTypeModel.name,
                    action: DBActions.DELETE + IncidenceTypeModel.name,
                    data: data.id
                });

                // respond request
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: IncidenceTypeModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, IncidencesTypesController.name + ' - ' + DBActions.DELETE)
        }
    };
}

const incidencesTypesController = new IncidencesTypesController();
export default incidencesTypesController;
