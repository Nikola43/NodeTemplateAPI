import {Request, Response} from "express";
import {PanicButtonModel} from "../db/models/PanicButtonModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import PanicButtonErrors from "../constants/errors/PanicButtonErrors";
import GenericErrors from "../constants/errors/GenericErrors";
import DBActions from "../constants/DBActions";
import {DBUtil} from "../utils/DBUtil";
import {HttpComunicationUtil} from "../utils/HttpComunicationUtil";
import {UserModel} from "../db/models/UserModel";
import {LocationModel} from "../db/models/LocationModel";
import {PositionModel} from "../db/models/PositionModel";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class PanicButtonsController extends BaseController {
    // functions
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await PanicButtonModel.findAll({
                attributes: [
                    'id',
                    'user_id',
                    'description',
                    'cause',
                    'number',
                    'createdAt',
                ],
                where: {
                    deletedAt: {
                        [Op.is]: null
                    }
                },
                include: [
                    {
                        model: UserModel, as: 'user',
                        attributes: [ //Campos que se muestran en la relación
                             'id',
                             'name',
                            'lastname',
                            'phone',
                            'weight',
                            'height',
                            'bloodtype',
                            'pulsations_max_rest',
                            'vo2_max'
                        ]
                    },
                    {
                        model: LocationModel, as: 'location',
                        attributes: [ //Campos que se muestran en la relación
                            'id',
                            'user_id'
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
            ErrorUtil.handleError(res, e, PanicButtonsController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await PanicButtonModel.findByPk(req.params.id,{
                attributes: [
                    'id',
                    'user_id',
                    'description',
                    'cause',
                    'number',
                    'createdAt',
                ],
                include: [
                    {
                        model: UserModel, as: 'user',
                        attributes: [ //Campos que se muestran en la relación
                            'id',
                            'name',
                            'lastname',
                            'phone',
                            'weight',
                            'height',
                            'bloodtype',
                            'pulsations_max_rest',
                            'vo2_max'
                        ]
                    },
                    {
                        model: LocationModel, as: 'location',
                        attributes: [ //Campos que se muestran en la relación
                            'id',
                            'user_id'
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
                : res.status(HttpStatus.NOT_FOUND).send({error: PanicButtonModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, PanicButtonsController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: PanicButtonModel = req.body;

        // check if request is valid and if user doesn't exists
        if (this.validateInsert(data, res)) {

            // insert
            const result = await DBUtil.insertModel(this, PanicButtonModel, data);

            // respond request
            HttpComunicationUtil.respondInsertRequest(this, PanicButtonModel, result, res);
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        const data: PanicButtonModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.updatedAt = new Date();        // set updated date

        // update
        const result = await DBUtil.updateModel(this, PanicButtonModel, data, DBActions.UPDATE);

        // check query result and respond
        await HttpComunicationUtil.respondUpdateRequest(this, PanicButtonModel, result, data.id, res);
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {
        const data: PanicButtonModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.deletedAt = new Date();        // set deleteAt date

        // update
        const result = await DBUtil.updateModel(this, PanicButtonModel, data, DBActions.DELETE);

        // check query result and respond
        await HttpComunicationUtil.respondDeleteRequest(this, PanicButtonModel, result, data.id, res);
    };

    validateInsert = (data: any, res: Response): boolean => {
        // check if field callet 'location_id' are set
        // if field not are set, then send empty required field error
        if (!data.user_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: PanicButtonModel.name + " " + PanicButtonErrors.USERID_EMPTY_ERROR});
            return false;
        }
        return true;
    };
}

const panicButtonsController = new PanicButtonsController();
export default panicButtonsController;
