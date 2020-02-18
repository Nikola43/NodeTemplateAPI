import {Request, Response} from "express";
import {MultimediaContentModel} from "../db/models/MultimediaContentModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import GenericErrors from "../constants/errors/GenericErrors";
import DBActions from "../constants/DBActions";
import {DBUtil} from "../utils/DBUtil";
import {HttpComunicationUtil} from "../utils/HttpComunicationUtil";
import {MultimediaContentTypeModel} from "../db/models/typesModels/MultimediaContentTypeModel";
import {LocationModel} from "../db/models/LocationModel";
import {PositionModel} from "../db/models/PositionModel";
import * as jwt from "jsonwebtoken";
import config from "../config/Config";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class MultimediaContentsController extends BaseController {
    // functions
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await MultimediaContentModel.findAll({

                attributes: [
                    'id',
                    'user_id',
                    'name',
                    'url',
                    'size',
                    'createdAt'
                ],
                where: {
                    deletedAt: {
                        [Op.is]: null
                    }
                },
                include: [
                    {
                        model: MultimediaContentTypeModel, as: 'type',
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
            // if not has result, send empty array
            queryResult
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, MultimediaContentsController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await MultimediaContentModel.findByPk(req.params.id, {

                attributes: [
                    'id',
                    'user_id',
                    'name',
                    'url',
                    'size',
                    'createdAt'
                ],
                include: [
                    {
                        model: MultimediaContentTypeModel, as: 'type', attributes: [['type', 'name']]
                    },
                    {
                        model: LocationModel, as: 'location',
                        attributes: [ //Campos que se muestran en la relación
                            'id',
                        ],
                        include: [{model: PositionModel, as: 'position', attributes: ['Id', 'Latitude', 'Longitude']}]
                    }
                ]
            });

            // if has results, then send result data
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: MultimediaContentModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, MultimediaContentsController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: MultimediaContentModel = req.body;

        // check if request is valid and if user doesn't exists
        if (this.validateInsert(data, res)
            && !await DBUtil.checkIfExistsByField(this, MultimediaContentModel, 'name', data.name)) {

            // insert
            const result = await DBUtil.insertModel(this, MultimediaContentModel, data);

            // respond request
            HttpComunicationUtil.respondInsertRequest(this, MultimediaContentModel, result, res);
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        const data: MultimediaContentModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.updatedAt = new Date();        // set updated date

        // update
        const result = await DBUtil.updateModel(this, MultimediaContentModel, data, DBActions.UPDATE);

        // check query result and respond
        await HttpComunicationUtil.respondUpdateRequest(this, MultimediaContentModel, result, data.id, res);
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {
        const data: MultimediaContentModel = req.body; // create model from request body data
        data.id = Number(req.params.id);    // get model id(pk) from request params
        data.deletedAt = new Date();        // set deleteAt date

        // update
        const result = await DBUtil.updateModel(this, MultimediaContentModel, data, DBActions.DELETE);

        // check query result and respond
        await HttpComunicationUtil.respondDeleteRequest(this, MultimediaContentModel, result, data.id, res);
    };

    validateInsert = (data: any, res: Response): boolean => {
        // check if field called 'user_id' are set
        // if field not are set, then send empty required field error
        if (!data.user_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: MultimediaContentModel.name + " " + GenericErrors.USER_ID_EMPTY_ERROR});
            return false;
        }

        // check if field callet 'location_id' are set
        // if field not are set, then send empty required field error
        if (!data.location_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: MultimediaContentModel.name + " " + GenericErrors.LOCATION_ID_EMPTY_ERROR});
            return false;
        }

        // check if field called 'type_id' are set
        // if field not are set, then send empty required field error
        if (!data.type_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: MultimediaContentModel.name + " " + GenericErrors.TYPE_EMPTY_ERROR});
            return false;
        }

        // check if field callet 'name' are set
        // if field not are set, then send empty required field error
        if (!data.name) {
            res.status(HttpStatus.BAD_REQUEST).send({error: MultimediaContentModel.name + " " + GenericErrors.NAME_EMPTY_ERROR});
            return false;
        }

        // check if field called 'url' are set
        // if field not are set, then send empty required field error
        if (!data.url) {
            res.status(HttpStatus.BAD_REQUEST).send({error: MultimediaContentModel.name + " " + GenericErrors.USER_ID_EMPTY_ERROR});
            return false;
        }
        return true;
    };

    upload = async (req: any, res: any, next: any) => {
        let token = <string>req.headers['authorization'];
        let jwtPayload;

        //Try to validate the token and get data
        try {
            token = token.replace('Bearer ', '');
            jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        } catch (error) {
            //If token is not valid, respond with 401 (unauthorized)
            res.status(401).send({error: "unauthorized"});
            return;
        }

        console.log(jwtPayload);

        try {
            console.log(req.files);
            if (!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                let uploadedFile = req.files.uploadedFile;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                await uploadedFile.mv('./uploads/' + uploadedFile.name);

                //TODO
                // get type id
                // get location id by user id
                const multimediaContent = {
                    user_id: 1,
                    location_id: 1,
                    type_id: 1,
                    name: uploadedFile.name,
                    url: 'https://signis.app/multimedia/' + uploadedFile.name,
                    size: uploadedFile.size
                };

                console.log(multimediaContent);

                // check if request is valid and if user doesn't exists
                if (this.validateInsert(multimediaContent, res)) {

                    // insert
                    const result = await DBUtil.insertModel(this, MultimediaContentModel, multimediaContent);

                    // respond request
                    HttpComunicationUtil.respondInsertRequest(this, MultimediaContentModel, result, res);
                }
            }
        } catch (err) {
            res.status(500).send(err);
        }
    };

    getAllbyUserID = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        const userId = req.params.id;

        // check if field called 'type_id' are set
        // if field not are set, then send empty required field error
        if (!userId) {
            res.status(HttpStatus.BAD_REQUEST).send({error: MultimediaContentModel.name + " " + GenericErrors.USER_ID_EMPTY_ERROR});
            return false;
        }
        // find all records
        try {
            queryResult = await MultimediaContentModel.findAll({

                attributes: [
                    'id',
                    'user_id',
                    'name',
                    'url',
                    'createdAt'
                ],
                where: {
                    deletedAt: {
                        [Op.is]: null
                    },

                    user_id: {
                        [Op.eq]: userId
                    }
                },
                include: [
                    {
                        model: MultimediaContentTypeModel, as: 'type',
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
            // if not has result, send empty array
            queryResult
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, MultimediaContentsController.name + ' - ' + DBActions.GET_ALL)
        }
    };

}

const multimediaContentsController = new MultimediaContentsController();
export default multimediaContentsController;
