import {Request, Response} from "express";
import {ResourceModel} from "../db/models/ResourceModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import ResourceErrors from "../constants/errors/ResourceErrors";
import GenericErrors from "../constants/errors/GenericErrors";
import DBActions from "../constants/DBActions";
import {DBUtil} from "../utils/DBUtil";
import {HttpComunicationUtil} from "../utils/HttpComunicationUtil";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class ResourcesController extends BaseController {
    // functions
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await ResourceModel.findAll({
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
            ErrorUtil.handleError(res, e, ResourcesController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await ResourceModel.findByPk(req.params.id);

            // if has results, then send result data
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: ResourceModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, ResourcesController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: ResourceModel = req.body;

        // check if request is valid and if user doesn't exists
        if (this.validateInsert(data, res)
            && !await DBUtil.checkIfExistsByField(this, ResourceModel, 'name', data.name)) {

            // insert
            const result = await DBUtil.insertModel(this, ResourceModel, data);

            // respond request
            HttpComunicationUtil.respondInsertRequest(this, ResourceModel, result, res);
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        const data: ResourceModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.updatedAt = new Date();        // set updated date

        // update
        const result = await DBUtil.updateModel(this, ResourceModel, data, DBActions.UPDATE);

        // check query result and respond
        await HttpComunicationUtil.respondUpdateRequest(this, ResourceModel, result, data.id, res);
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {
        const data: ResourceModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.deletedAt = new Date();        // set deleteAt date

        // update
        const result = await DBUtil.updateModel(this, ResourceModel, data, DBActions.DELETE);

        // check query result and respond
        await HttpComunicationUtil.respondDeleteRequest(this, ResourceModel, result, data.id, res);
    };

    validateInsert = (data: any, res: Response): boolean => {
        // check if field callet 'location_id' are set
        // if field not are set, then send empty required field error
        if (!data.center_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: ResourceModel.name + " " + ResourceErrors.RESOURCE_CENTER_ID_EMPTY_ERROR});
            return false;
        }

        // check if field called 'type_id' are set
        // if field not are set, then send empty required field error
        if (!data.type_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: ResourceModel.name + " " + GenericErrors.TYPE_EMPTY_ERROR});
            return false;
        }

        // check if field callet 'name' are set
        // if field not are set, then send empty required field error
        if (!data.name) {
            res.status(HttpStatus.BAD_REQUEST).send({error: ResourceModel.name + " " + GenericErrors.NAME_EMPTY_ERROR});
            return false;
        }

        // check if field callet 'status' are set
        // if field not are set, then send empty required field error
        if (!data.status) {
            res.status(HttpStatus.BAD_REQUEST).send({error: ResourceModel.name + " " + ResourceErrors.STATUS_EMPTY_ERROR});
            return false;
        }
        return true;
    };
}

const resourcesController = new ResourcesController();
export default resourcesController;
