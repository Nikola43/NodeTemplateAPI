import {Request, Response} from "express";
import {LocationModel} from "../db/models/LocationModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import LocationErrors from "../constants/errors/LocationErrors";
import GenericErrors from "../constants/errors/GenericErrors";
import DBActions from "../constants/DBActions";
import {DBUtil} from "../utils/DBUtil";
import {HttpComunicationUtil} from "../utils/HttpComunicationUtil";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class LocationsController extends BaseController {
    // functions
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await LocationModel.findAll({
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
            ErrorUtil.handleError(res, e, LocationsController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await LocationModel.findByPk(req.params.id);

            // if has results, then send result data
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: LocationModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, LocationsController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

// INSERT
    insert = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: LocationModel = req.body;

        // check if request is valid and if user doesn't exists
        if (this.validateInsert(data, res)
            && !await DBUtil.checkIfExistsByField(this, LocationModel, 'name', data.name)) {

            // insert
            const result = await DBUtil.insertModel(this, LocationModel, data);

            // respond request
            HttpComunicationUtil.respondInsertRequest(this, LocationModel, result, res);
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        const data: LocationModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.updatedAt = new Date();        // set updated date

        // update
        const result = await DBUtil.updateModel(this, LocationModel, data, DBActions.UPDATE);

        // check query result and respond
        await HttpComunicationUtil.respondUpdateRequest(this, LocationModel, result, data.id, res);
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {
        const data: LocationModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.deletedAt = new Date();        // set deleteAt date

        // update
        const result = await DBUtil.updateModel(this, LocationModel, data, DBActions.DELETE);

        // check query result and respond
        await HttpComunicationUtil.respondDeleteRequest(this, LocationModel, result, data.id, res);
    };

    validateInsert = (data: any, res: Response): boolean => {
        // check if field called 'type_id' are set
        // if field not are set, then send empty required field error
        if (!data.type_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: LocationModel.name + " " + GenericErrors.TYPE_EMPTY_ERROR});
            return false;
        }

        // check if field callet 'location_id' are set
        // if field not are set, then send empty required field error
        if (!data.coordinates_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: LocationModel.name + " " + LocationErrors.LOCATION_COORDINATE_ID_EMPTY_ERROR});
            return false;
        }
        return true;
    };
}

const locationsController = new LocationsController();
export default locationsController;
