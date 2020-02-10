import {Request, Response} from "express";
import {ResourceTypeModel} from "../../db/models/typesModels/ResourceTypeModel";
import BaseController from "../BaseController";
import {ErrorUtil} from "../../utils/ErrorUtil";
import Messages from "../../constants/messages/Messages";
import GenericErrors from "../../constants/errors/GenericErrors";
import DBActions from "../../constants/DBActions";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class ResourcesTypesController extends BaseController {
    // functions
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await ResourceTypeModel.findAll({
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
            ErrorUtil.handleError(res, e, ResourcesTypesController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await ResourceTypeModel.findByPk(req.params.id);

            // if has results, then send result data
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: ResourceTypeModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, ResourcesTypesController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: ResourceTypeModel = req.body;
        let tempData: any;

        // check if field called 'type' are set
        // if field not are set, then send empty required field error
        if (!data.type) {
            res.status(HttpStatus.BAD_REQUEST).send({error: ResourceTypeModel.name + " " + GenericErrors.TYPE_EMPTY_ERROR});
            return;
        }

        // find if exists any record with same request value in type field
        try {
            tempData = await ResourceTypeModel.findOne({
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
                res.status(HttpStatus.CONFLICT).send({error: ResourceTypeModel.name + " " + GenericErrors.ALREADY_EXIST_ERROR});
                return;
            } else {
                // create new record from request body data
                const newData = await ResourceTypeModel.create(data);

                // emit new data


                // respond request
                res.status(HttpStatus.CREATED).send(newData)
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, ResourcesTypesController.name + ' - ' + DBActions.INSERT);
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: ResourceTypeModel = req.body;

        // get record id(pk) from request params
        data.id = Number(req.params.id);

        // set updated date
        data.updatedAt = new Date();

        // update
        try {
            const updateResult = await ResourceTypeModel.update(data,
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
                const updatedData = await ResourceTypeModel.findByPk(data.id);

                // emit updated data


                // respond request
                res.status(HttpStatus.OK).send(updatedData);

            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: ResourceTypeModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, ResourcesTypesController.name + ' - ' + DBActions.UPDATE);
        }
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: ResourceTypeModel = req.body;

        // get record id(pk) from request params
        data.id = Number(req.params.id);

        // set deleted date
        data.deletedAt = new Date();

        // delete
        try {
            const deleteResult = await ResourceTypeModel.update(data,
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


                // respond request
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: ResourceTypeModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, ResourcesTypesController.name + ' - ' + DBActions.DELETE)
        }
    };

    validateInsert = (data: any, res: Response): boolean => {
        return true;
    };

    respondInsertRequest = (result: any, res: Response) => {

    };

    respondDeleteRequest = async (result: any, modelId: number, res: Response) => {

    };

    respondUpdateRequest = async (result: any, modelId: number, res: Response) => {

    };
}

const centersTypesController = new ResourcesTypesController();
export default centersTypesController;
