import {Request, Response} from "express";
import {Position} from "../db/models/Position";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import Messages from "../constants/messages/Messages";
import server from "../server";
import GenericErrors from "../constants/errors/GenericErrors";
import DBActions from "../constants/DBActions";
import CoordinateErrors from "../constants/errors/CoordinateErrors";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class CoordinatesController extends BaseController {
    // functions
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await Position.findAll({
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
            ErrorUtil.handleError(res, e, CoordinatesController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await Position.findByPk(req.params.id);

            // if has results, then send result data
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: Position.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, CoordinatesController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: Position = req.body;

        if(this.validateInsert(data, req, res, next)) {
            try {
                // create new record from request body data
                const newData = await Position.create(data);

                // emit new data
                server.io.emit('DBEvent', {
                    modelName: Position.name,
                    action: DBActions.INSERT + Position.name,
                    data: newData
                });

                // respond request
                res.status(HttpStatus.CREATED).send(newData)

            } catch (e) {
                ErrorUtil.handleError(res, e, CoordinatesController.name + ' - ' + DBActions.INSERT);
            }
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: Position = req.body;

        // get record id(pk) from request params
        data.Id = Number(req.params.id);

        // set updated date
        data.updatedAt = new Date();

        // update
        try {
            const updateResult = await Position.update(data,
                {
                    where: {
                        id: {
                            [Op.eq]: data.Id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });

            // if it has affected one row
            if (updateResult[0] === 1) {

                // find updated data
                const updatedData = await Position.findByPk(data.Id);

                // emit updated data
                server.io.emit('DBEvent', {
                    modelName: Position.name,
                    action: DBActions.UPDATE + Position.name,
                    data: updatedData
                });

                // respond request
                res.status(HttpStatus.OK).send(updatedData);

            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: Position.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, CoordinatesController.name + ' - ' + DBActions.UPDATE);
        }
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: Position = req.body;

        // get record id(pk) from request params
        data.Id = Number(req.params.id);

        // set deleted date
        data.deletedAt = new Date();

        // delete
        try {
            const deleteResult = await Position.update(data,
                {
                    where: {
                        id: {
                            [Op.eq]: data.Id
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
                    modelName: Position.name,
                    action: DBActions.DELETE + Position.name,
                    data: data.Id
                });

                // respond request
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: Position.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, CoordinatesController.name + ' - ' + DBActions.DELETE)
        }
    };

    validateInsert = (data: any, req: Request, res: Response, next: Function): boolean => {
        let valid = false;

        // check if field called 'Latitude' are set
        // if field not are set, then send empty required field error
        if (!data.Latitude) {
            res.status(HttpStatus.BAD_REQUEST).send({error: Position.name + " " + CoordinateErrors.COORDINATE_LAT_EMPTY_ERROR});
            valid = false;
        }

        // check if field callet 'Longitude' are set
        // if field not are set, then send empty required field error
        if (!data.Longitude) {
            res.status(HttpStatus.BAD_REQUEST).send({error: Position.name + " " + CoordinateErrors.COORDINATE_LON_EMPTY_ERROR});
            valid = false;
        }
        return valid;
    };

    checkIfExists = async (data: any, req: Request, res: Response, next: Function): Promise<boolean> => {
        return false;
    };
}

const coordinatesController = new CoordinatesController();
export default coordinatesController;

