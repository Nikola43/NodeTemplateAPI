import {Request, Response} from "express";
import {PositionModel} from "../db/models/PositionModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import Messages from "../constants/messages/Messages";
import GenericErrors from "../constants/errors/GenericErrors";
import DBActions from "../constants/DBActions";
import CoordinateErrors from "../constants/errors/CoordinateErrors";
import {DBUtil} from "../utils/DBUtil";
import {HttpComunicationUtil} from "../utils/HttpComunicationUtil";

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
            queryResult = await PositionModel.findAll({
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
            queryResult = await PositionModel.findByPk(req.params.id);

            // if has results, then send result data
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: PositionModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, CoordinatesController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: PositionModel = req.body;

        // check if request is valid and if user doesn't exists
        if (this.validateInsert(data, res)) {

            // insert
            const result = await DBUtil.insertModel(this, Position, data);

            // respond request
            HttpComunicationUtil.respondInsertRequest(this, Position, result, res);
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        const data: Position = req.body; // create model from request body data
        data.Id = Number(req.params.id);    // get model id(pk) from request params
        data.updatedAt = new Date();        // set updated date

        // update
        const result = await DBUtil.updateModel(this, Position, data, DBActions.UPDATE);

        // check query result and respond
        await HttpComunicationUtil.respondUpdateRequest(this, Position, result, data.Id, res);
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {
        const data: Position = req.body; // create model from request body data
        data.Id = Number(req.params.id);    // get model id(pk) from request params
        data.deletedAt = new Date();        // set deleteAt date

        // update
        const result = await DBUtil.updateModel(this, Position, data, DBActions.DELETE);

        // check query result and respond
        await HttpComunicationUtil.respondDeleteRequest(this, Position, result, data.Id, res);
    };

    validateInsert = (data: any, res: Response): boolean => {
        // check if field called 'Latitude' are set
        // if field not are set, then send empty required field error
        if (!data.Latitude) {
            res.status(HttpStatus.BAD_REQUEST).send({error: PositionModel.name + " " + CoordinateErrors.COORDINATE_LAT_EMPTY_ERROR});
            valid = false;
        }

        // check if field callet 'Longitude' are set
        // if field not are set, then send empty required field error
        if (!data.Longitude) {
            res.status(HttpStatus.BAD_REQUEST).send({error: PositionModel.name + " " + CoordinateErrors.COORDINATE_LON_EMPTY_ERROR});
            valid = false;
        }
        return true;
    };
}

const coordinatesController = new CoordinatesController();
export default coordinatesController;

