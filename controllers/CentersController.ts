import {Request, Response} from "express";
import {CenterModel} from "../db/models/CenterModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import CenterErrors from "../constants/errors/CenterErrors";
import GenericErrors from "../constants/errors/GenericErrors";
import DBActions from "../constants/DBActions";
import {CenterTypeModel} from "../db/models/typesModels/CenterTypeModel";
import {LocationModel} from "../db/models/LocationModel";
import {UserModel} from "../db/models/UserModel";
import {ResourceModel} from "../db/models/ResourceModel";
import socketManager from "../managers/SocketManager";
import {DBUtil} from "../utils/DBUtil";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class CentersController extends BaseController {
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await CenterModel.findAll({
                where: {
                    deletedAt: {
                        [Op.is]: null
                    }
                },
                //include: [CenterModel.associations.CenterTypeModel]
            });

            // if has results, then send result data
            // if not has result, send empty array
            queryResult
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, CentersController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await CenterModel.findByPk(req.params.id, {
                include: [
                    {model: CenterTypeModel, as: 'Type'},
                    {model: LocationModel, as: 'Location'},
                    {
                        model: UserModel, as: 'Users',
                        attributes: [ //Campos que se muestran en la relación
                            'id',
                            'email',
                            'name',
                            'role'
                        ]
                    },
                    {model: ResourceModel, as: 'Resources'},
                ],
                rejectOnEmpty: true,
            });

            // // if has results, then send result data
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: CenterModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, CentersController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: CenterModel = req.body;

        // check if request is valid and
        // if user exists
        if (this.validateInsert(data, res)
            && !await DBUtil.checkIfExistsByField(this, CenterModel, 'name', data.name)) {

            // insert
            const result = await DBUtil.insertModel(this, CenterModel, data);

            // respond request
            this.respondInsertRequest(result, res);
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: CenterModel = req.body;

        // get model id(pk) from request params
        data.id = Number(req.params.id);

        // set updated date
        data.updatedAt = new Date();

        // update
        const result = await DBUtil.updateModel(this, CenterModel, data);

        // check query result and respond
        this.respondUpdateRequest(result, data.id, res);
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: CenterModel = req.body;

        // get record id(pk) from request params
        data.id = Number(req.params.id);

        // set deleted date
        data.deletedAt = new Date();

        // delete
        const result = DBUtil.updateModel(this, CenterModel, data);

        // check query result and respond
        this.respondDeleteRequest(result, data.id, res);
    };

    validateInsert = (data: any, res: Response): boolean => {

        let valid = true;

        // check if field called 'type_id' are set
        // if field not are set, then send empty required field error
        if (!data.type_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: CenterModel.name + " " + GenericErrors.TYPE_EMPTY_ERROR});
            valid = false;
        }

        // check if field callet 'location_id' are set
        // if field not are set, then send empty required field error
        if (!data.location_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: CenterModel.name + " " + CenterErrors.CENTER_LOCATION_ID_EMPTY_ERROR});
            valid = false;
        }

        // check if field callet 'name' are set
        // if field not are set, then send empty required field error
        if (!data.name) {
            res.status(HttpStatus.BAD_REQUEST).send({error: CenterModel.name + " " + GenericErrors.NAME_EMPTY_ERROR});
            valid = false;
        }

        return valid;
    };

    respondInsertRequest = (queryResult: any, res: Response) => {
        if (queryResult instanceof CenterModel) {
            socketManager.emitSocketEvent('CenterDBEvent', DBActions.INSERT, queryResult);
            res.status(HttpStatus.CREATED).send(queryResult);
        } else {
            ErrorUtil.handleError(res, queryResult, CentersController.name + ' - ' + DBActions.GET_BY_ID);
        }
    };

    respondUpdateRequest = async (queryResult: any, modelId: number, res: Response) => {
        try {
            // if it has affected one row
            if (queryResult[0] === 1) {

                // find updated data
                const updatedData = await CenterModel.findByPk(modelId);

                // emit updated data
                socketManager.emitSocketEvent('CenterDBEvent', DBActions.UPDATE, updatedData);

                // respond request
                res.status(HttpStatus.OK).send(updatedData);
            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: CenterModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, CentersController.name + ' - ' + DBActions.UPDATE)
        }
    };

    respondDeleteRequest = async (queryResult: any, modelId: number, res: Response) => {
        try {
            // if it has affected one row
            if (queryResult[0] === 1) {

                // find deleted data
                const deletedData = await CenterModel.findByPk(modelId);

                // emit deleted data
                socketManager.emitSocketEvent('CenterDBEvent', DBActions.DELETE, deletedData);

                // respond request
                res.status(HttpStatus.OK).send(deletedData);
            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: CenterModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, CentersController.name + ' - ' + DBActions.UPDATE)
        }
    }
}

const
    centersController = new CentersController();
export default centersController;
