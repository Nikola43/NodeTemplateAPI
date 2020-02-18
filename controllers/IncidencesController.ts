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

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class IncidencesController extends BaseController {

    getAll = async (req: Request, res: Response, next: Function) => {

        let queryResult: any;

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
                where: { deletedAt: { [Op.is]: null } },
                include: [ { model: IncidenceTypeModel, as: 'type', attributes: [ ['type', 'name'] ] } ]
            });

            queryResult
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, IncidencesController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    getById = async (req: Request, res: Response, next: Function) => {

        let queryResult: any;

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
                        model: IncidenceTypeModel, as: 'type', attributes: [ ['type', 'name'] ]
                    },
                    {
                        model: IncidenceTypeModel, as: 'type', attributes: [ ['type', 'name'] ]
                    },
                    {
                        model: LocationModel, as: 'location', attributes: [ 'id' ],
                        include: [ { model: PositionModel, as: 'position', attributes: [ 'Id', 'Latitude', 'Longitude' ] } ]
                    },
                ]
            });

            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: IncidenceModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, IncidencesController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

    insert = async (req: Request, res: Response, next: Function) => {

        const data: IncidenceModel = req.body;

        if (this.validateInsert(data, res)
            && !await DBUtil.checkIfExistsByField(this, IncidenceModel, 'name', data.name)) {

            const result = await DBUtil.insertModel(this, IncidenceModel, data);

            HttpComunicationUtil.respondInsertRequest(this, IncidenceModel, result, res);
        }
    };

    update = async (req: Request, res: Response, next: Function) => {
        const data: IncidenceModel = req.body;
        data.id = Number(req.params.id);
        data.updatedAt = new Date();

        const result = await DBUtil.updateModel(this, IncidenceModel, data, DBActions.UPDATE);

        await HttpComunicationUtil.respondUpdateRequest(this, IncidenceModel, result, data.id, res);
    };

    delete = async (req: Request, res: Response, next: Function) => {
        const data: IncidenceModel = req.body;
        data.id = Number(req.params.id);
        data.deletedAt = new Date();

        const result = await DBUtil.updateModel(this, IncidenceModel, data, DBActions.DELETE);

        await HttpComunicationUtil.respondDeleteRequest(this, IncidenceModel, result, data.id, res);
    };

    validateInsert = (data: any, res: Response): boolean => {

        if (!data.type_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + GenericErrors.TYPE_EMPTY_ERROR});
            return false;
        }

        if (!data.user_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + GenericErrors.USER_ID_EMPTY_ERROR});
            return false;
        }

        if (!data.location_id) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + GenericErrors.LOCATION_ID_EMPTY_ERROR});
            return false;
        }

        if (!data.name) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + GenericErrors.NAME_EMPTY_ERROR});
            return false;
        }

        if (!data.subtype) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + IncidenceErrors.INCIDENCE_SUBTYPE_EMPTY_ERROR});
            return false;
        }

        if (!data.status) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + IncidenceErrors.INCIDENCE_STATUS_EMPTY_ERROR});
            return false;
        }

        if (!data.level) {
            res.status(HttpStatus.BAD_REQUEST).send({error: IncidenceModel.name + " " + IncidenceErrors.INCIDENCE_LEVEL_EMPTY_ERROR});
            return false;
        }
        return true;
    };

    getLastPosition = async (req: Request, res: Response, next: Function) => {

        const incidence_id = req.params.id;

        if (!incidence_id) {
            res.status(HttpStatus.BAD_REQUEST).send(GenericErrors.INCIDENCE_ID_EMPTY_ERROR);
            return;
        }
        try {
            const data = await IncidenceModel.findOne({
                attributes: [ 
                    'id',
                ],
                include: [
                    {
                        model: LocationModel, as: 'location', attributes: [ 'id' ],
                        include: [ { model: PositionModel, as: 'position', attributes: [ 'Id', 'Latitude', 'Longitude' ] } ]
                    },
                ],
                where: { id: { [Op.eq]: incidence_id } }
            });
            res.status(200).send(data);
        } catch (e) {
            ErrorUtil.handleError(res, e, IncidencesController.name + ' - ' + DBActions.GET_BY_EMAIL)
        }

    };
}

const incidencesController = new IncidencesController();
export default incidencesController;