import {Request, Response} from "express";
import {CenterModel} from "../db/models/CenterModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import CenterErrors from "../errors/CenterErrors";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class CentersController extends BaseController {
    getAll = async (req: Request, res: Response, next: Function) => {
        try {
            res.status(200).send(await CenterModel.findAll())
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get all centers');
        }
    };

    getById = async (req: Request, res: Response, next: Function) => {
        try {
            const data = CenterModel.findByPk(req.params.id);
            data ? res.status(200).send(data) : res.status(404).send(CenterErrors.CENTER_NOT_FOUND_ERROR);
        } catch (e) {
            ErrorUtil.handleError(res,e, 'get all centers');
        }
    };

    insert = async (req: Request, res: Response, next: Function) => {
        // get center from request
        const data: CenterModel = req.body;

        // check if type id are set
        if (!data.type_id) {
            res.status(400).send(CenterErrors.CENTER_TYPE_ID_EMPTY_ERROR);
            return;
        }

        // check if name are set
        if (!data.name) {
            res.status(400).send(CenterErrors.CENTER_NAME_EMPTY_ERROR);
            return;
        }

        try {
            const tempCenter = await CenterModel.findOne({
                attributes: [
                    'name',
                ], where: {
                    name: {
                        [Op.eq]: data.name
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // check if device already exist
            if (tempCenter) {
                res.status(409).send(CenterErrors.CENTER_ALREADY_EXIST_ERROR);
                return;
            } else {
                // Create center from request data
                res.status(201).send(await CenterModel.create())
            }
        } catch (e) {
            ErrorUtil.handleError(res,e, 'delete center');
        }
    };

    update = async (req: Request, res: Response, next: Function) => {
        // create model from request data
        const data: CenterModel = req.body;
        data.id = Number(req.params.id);
        data.updatedAt = new Date();

        // update
        try {
            data.update(data,
                {
                    where: {
                        id: {
                            [Op.eq]: data.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(data);
        } catch (e) {
            ErrorUtil.handleError(res,e, 'update center');
        }
    };

    delete = async (req: Request, res: Response, next: Function) => {
        // get id from request params
        const data = new CenterModel();
        data.id = Number(req.params.id);
        data.updatedAt = new Date();

        // delete
        try {
            data.update(data,
                {
                    where: {
                        id: {
                            [Op.eq]: data.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({success: "Centro eliminado"});
        } catch (e) {
            ErrorUtil.handleError(res,e, 'delete center');
        }
    };
}

const centersController = new CentersController();
export default centersController;
