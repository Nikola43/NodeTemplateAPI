import {Request, Response} from "express";
import {CenterModel} from "../db/models/CenterModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import CenterErrors from "../constants/errors/CenterErrors";
import GenericErrors from "../constants/errors/GenericErrors";
import DBActions from "../constants/DBActions";
import {CenterTypeModel} from "../db/models/typesModels/CenterTypeModel";
import {LocationModel} from "../db/models/LocationModel";
import {DBUtil} from "../utils/DBUtil";
import {HttpComunicationUtil} from "../utils/HttpComunicationUtil";
import {PositionModel} from "../db/models/PositionModel";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class CentersController extends BaseController {
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {
        // find all records
        try {
            const queryResult = await CenterModel.findAll({
                attributes: [
                    'id',
                    'name',
                    'description',
                    'phone',
                    'email',
                    'leader',
                    'schedule',
                ],
                where: {
                    deletedAt: {
                        [Op.is]: null
                    }
                },
                include: [
                    {
                        model: CenterTypeModel, as: 'type',
                        attributes: [ //Campos que se muestran en la relación
                            ['type', 'name'],
                            'temporary'
                        ]
                    },
                    {
                        model: LocationModel, as: 'location',
                        attributes: [ //Campos que se muestran en la relación
                            'id',
                        ],
                        include: [
                            {
                                model: PositionModel, as: 'position',
                                attributes: [ //Campos que se muestran en la relación
                                    'Id',
                                    'Latitude',
                                    'Longitude'
                                ]
                            },
                        ]
                    },
                ]
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
        // find record by pk
        try {
            const queryResult = await CenterModel.findByPk(req.params.id, {
                attributes: [
                    'id',
                    'name',
                    'description',
                    'phone',
                    'email',
                    'leader',
                    'schedule',
                ],
                include: [
                    {
                        model: CenterTypeModel, as: 'type',
                        attributes: [ //Campos que se muestran en la relación
                            ['type', 'name'],
                            'temporary'
                        ]
                    },
                    {
                        model: LocationModel, as: 'location',
                        attributes: [ //Campos que se muestran en la relación
                            'id',
                        ],
                        include: [
                            {
                                model: PositionModel, as: 'position',
                                attributes: [ //Campos que se muestran en la relación
                                    'Id',
                                    'Latitude',
                                    'Longitude'
                                ]
                            },
                        ]
                    },
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

        // check if request is valid and if user doesn't exists
        if (this.validateInsert(data, res)
            && !await DBUtil.checkIfExistsByField(this, CenterModel, 'name', data.name)) {

            // insert
            const result = await DBUtil.insertModel(this, CenterModel, data);

            // respond request
            HttpComunicationUtil.respondInsertRequest(this, CenterModel, result, res);
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        const data: CenterModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.updatedAt = new Date();        // set updated date

        // update
        const result = await DBUtil.updateModel(this, CenterModel, data, DBActions.UPDATE);

        // check query result and respond
        await HttpComunicationUtil.respondUpdateRequest(this, CenterModel, result, data.id, res);
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {
        const data: CenterModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.deletedAt = new Date();        // set deleteAt date

        // update
        const result = await DBUtil.updateModel(this, CenterModel, data, DBActions.DELETE);

        // check query result and respond
        await HttpComunicationUtil.respondDeleteRequest(this, CenterModel, result, data.id, res);
    };

    validateInsert = (data: any, res: Response): boolean => {
        // check if field are set
        // if field not are set, then send empty required field error
        if (!data.type_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: CenterModel.name + " " + GenericErrors.TYPE_EMPTY_ERROR});
            return false;
        }

        // check if field are set
        // if field not are set, then send empty required field error
        if (!data.location_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: CenterModel.name + " " + CenterErrors.CENTER_LOCATION_ID_EMPTY_ERROR});
            return false;
        }

        // check if field are set
        // if field not are set, then send empty required field error
        if (!data.name) {
            res.status(HttpStatus.BAD_REQUEST).send({error: CenterModel.name + " " + GenericErrors.NAME_EMPTY_ERROR});
            return false;
        }

        // if pass all fields validations return true
        return true;
    };
}

const centersController = new CentersController();
export default centersController;
