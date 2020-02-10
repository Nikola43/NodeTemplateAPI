import {Request, Response} from "express";
import {DeviceModel} from "../db/models/DeviceModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import Messages from "../constants/messages/Messages";
import server from "../server";
import GenericErrors from "../constants/errors/GenericErrors";
import DBActions from "../constants/DBActions";
import { DeviceTypeModel } from "../db/models/typesModels/DeviceTypeModel";
import {CenterModel} from "../db/models/CenterModel";
import {DBUtil} from "../utils/DBUtil";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class DevicesController extends BaseController {
    // functions
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await DeviceModel.findAll({
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
            ErrorUtil.handleError(res, e, DevicesController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await DeviceModel.findByPk(req.params.id,{
                include: [{model: DeviceTypeModel, as: 'Type'}]
            });

            // if has results, then send result data
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: DeviceModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, DevicesController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: DeviceModel = req.body;

        // check if request is valid
        // check if user exists
        if (this.validateInsert(data, res)
            && !await DBUtil.checkIfExistsByField(this, DeviceModel, 'name', data.name)) {
            try {
                // create new record from request body data
                const newData = await DeviceModel.create(data);

                // emit new data


                // respond request
                res.status(HttpStatus.CREATED).send(newData)
            } catch (e) {
                ErrorUtil.handleError(res, e, DevicesController.name + ' - ' + DBActions.INSERT);
            }
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: DeviceModel = req.body;

        // get record id(pk) from request params
        data.id = Number(req.params.id);

        // set updated date
        data.updatedAt = new Date();

        // update
        try {
            const updateResult = await DeviceModel.update(data,
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
                const updatedData = await DeviceModel.findByPk(data.id);

                // emit updated data


                // respond request
                res.status(HttpStatus.OK).send(updatedData);

            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: DeviceModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, DevicesController.name + ' - ' + DBActions.UPDATE);
        }
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: DeviceModel = req.body;

        // get record id(pk) from request params
        data.id = Number(req.params.id);

        // set deleted date
        data.deletedAt = new Date();

        // delete
        try {
            const deleteResult = await DeviceModel.update(data,
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
                res.status(HttpStatus.NOT_FOUND).send({error: DeviceModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, DevicesController.name + ' - ' + DBActions.DELETE)
        }
    };

    validateInsert = (data: any, res: Response): boolean => {
        // check if field called 'type_id' are set
        // if field not are set, then send empty required field error
        if (!data.type_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: DeviceModel.name + " " + GenericErrors.TYPE_EMPTY_ERROR});
            return false;
        }

        // check if field callet 'location_id' are set
        // if field not are set, then send empty required field error
        if (!data.name) {
            res.status(HttpStatus.BAD_REQUEST).send({error: DeviceModel.name + " " + GenericErrors.NAME_EMPTY_ERROR});
            return false;
        }
        return true;
    };

    respondInsertRequest = (result: any, res: Response) => {

    };

    respondDeleteRequest = async (result: any, modelId: number, res: Response) => {

    };

    respondUpdateRequest = async (result: any, modelId: number, res: Response) => {

    };

}

const devicesController = new DevicesController();
export default devicesController;
