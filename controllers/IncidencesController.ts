import {Request, Response} from "express";
import {IncidenceModel} from "../db/models/IncidenceModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import IncidenceErrors from "../constants/errors/IncidenceErrors";
import GenericErrors from "../constants/errors/GenericErrors";
import DBActions from "../constants/DBActions";
import {DBUtil} from "../utils/DBUtil";
import {HttpComunicationUtil} from "../utils/HttpComunicationUtil";
import {IncidenceTypeModel} from "../db/models/typesModels/IncidenceTypeModel";
import {LocationModel} from "../db/models/LocationModel";
import {PositionModel} from "../db/models/PositionModel";
import {CenterModel} from "../db/models/CenterModel";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class IncidencesController extends BaseController {
    // functions
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await IncidenceModel.findAll({
                attributes: [
                    'id',
                    'name',
                    'subtype',
                    'status',
                    'level',
                    'createdAt'
                ],
                where: {
                    deletedAt: {
                        [Op.is]: null
                    }
                },
                include: [
                    {
                        model: IncidenceTypeModel, as: 'type',
                        attributes: [ //Campos que se muestran en la relación
                            ['type', 'name']
                        ]

                }
            ]
            });

            // if has results, then send result data
            // if not has result, send empty array
            queryResult
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, IncidencesController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await IncidenceModel.findByPk(req.params.id, {
                attributes: [
                    'id',
                    'name',
                    'description',
                    'subtype',
                    'status',
                    'level',
                    'perimeter',
                    'area',
                    'strategy',
                    'tactic',
                    'maneuver',
                    'createdAt',
                    'user_id'
                ],
                include: [
                    {
                        model: IncidenceTypeModel, as: 'type',
                        attributes: [ //Campos que se muestran en la relación
                            ['type', 'name']
                        ]

                    },
                    {
                        model: IncidenceTypeModel, as: 'type',
                        attributes: [ //Campos que se muestran en la relación
                            ['type', 'name']
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
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: IncidenceModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, IncidencesController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };
    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: IncidenceModel = req.body;

        // check if request is valid and if user doesn't exists
        if (this.validateInsert(data, res)
            && !await DBUtil.checkIfExistsByField(this, IncidenceModel, 'name', data.name)) {

            // insert
            const result = await DBUtil.insertModel(this, IncidenceModel, data);

            // respond request
            HttpComunicationUtil.respondInsertRequest(this, IncidenceModel, result, res);
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        const data: IncidenceModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.updatedAt = new Date();        // set updated date

        // update
        const result = await DBUtil.updateModel(this, IncidenceModel, data, DBActions.UPDATE);

        // check query result and respond
        await HttpComunicationUtil.respondUpdateRequest(this, IncidenceModel, result, data.id, res);
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {
        const data: IncidenceModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.deletedAt = new Date();        // set deleteAt date

        // update
        const result = await DBUtil.updateModel(this, IncidenceModel, data, DBActions.DELETE);

        // check query result and respond
        await HttpComunicationUtil.respondDeleteRequest(this, IncidenceModel, result, data.id, res);
    };

    validateInsert = (data: any, res: Response): boolean => {
        // check if field called 'type_id' are set
        // if field not are set, then send empty required field error
        if (!data.type_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + GenericErrors.TYPE_EMPTY_ERROR});
            return false;
        }

        // check if field called 'user_id' are set
        // if field not are set, then send empty required field error
        if (!data.user_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + GenericErrors.USER_ID_EMPTY_ERROR});
            return false;
        }

        // check if field callet 'location_id' are set
        // if field not are set, then send empty required field error
        if (!data.location_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + GenericErrors.LOCATION_ID_EMPTY_ERROR});
            return false;
        }

        // check if field callet 'name' are set
        // if field not are set, then send empty required field error
        if (!data.name) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + GenericErrors.NAME_EMPTY_ERROR});
            return false;
        }

        // check if field callet 'subtype' are set
        // if field not are set, then send empty required field error
        if (!data.subtype) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + IncidenceErrors.INCIDENCE_SUBTYPE_EMPTY_ERROR});
            return false;
        }

        // check if field callet 'status' are set
        // if field not are set, then send empty required field error
        if (!data.status) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + IncidenceErrors.INCIDENCE_STATUS_EMPTY_ERROR});
            return false;
        }

        // check if field callet 'level' are set
        // if field not are set, then send empty required field error
        if (!data.level) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + IncidenceErrors.INCIDENCE_LEVEL_EMPTY_ERROR});
            return false;
        }
        return true;
    };

    getLastPosition = async (req: Request, res: Response, next: Function) => {

        const incidence_id = req.params.id;


        // check if incidence_id are set
        if (!incidence_id) {
            res.status(HttpStatus.BAD_REQUEST).send(GenericErrors.INCIDENCE_ID_EMPTY_ERROR);
            return;
        }
        try {
            const data = await IncidenceModel.findOne({
                attributes: [ //Campos que se muestran en la relación
                    'id',
                ],
                include: [
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
                where: {
                    id: {
                        [Op.eq]: incidence_id
                    }
                }
            });
            res.status(200).send(data);
        } catch (e) {
            ErrorUtil.handleError(res, e, IncidencesController.name + ' - ' + DBActions.GET_BY_EMAIL)
        }

    };
}

const incidencesController = new IncidencesController();
export default incidencesController;
