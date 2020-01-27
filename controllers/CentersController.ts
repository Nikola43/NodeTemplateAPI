import {Request, Response} from "express";
import {CenterModel} from "../db/models/CenterModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class CenterController extends BaseController {
    getAll = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await CenterModel.findAll();
            data ? res.status(200).send(data) : res.status(200).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get all center');
        }
    };

    getById = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await CenterModel.findByPk(req.params.id);
            data ? res.status(200).send(data) : res.status(200).send({error: "data not found"});
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get center by id');
        }
    };

    insert = async (req: Request, res: Response, next: Function) => {
        try {
            res.status(200).send(await CenterModel.create(req.body));
        } catch (e) {
            ErrorUtil.handleError(res, e, 'insert center');
        }
    };

    update = async (req: Request, res: Response, next: Function) => {
        let data: CenterModel = req.body;
        data.id = req.query.id;
        data.updatedAt = new Date();

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
            ErrorUtil.handleError(res, e, 'update center');
        }
    };

    delete = async (req: Request, res: Response, next: Function) => {
        const data: CenterModel = req.body;
        data.id = req.query.id;

        try {
            data.update({
                    deletedAt: new Date()
                },
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
            ErrorUtil.handleError(res, e, 'delete center');
        }
    };
}

const centersController = new CenterController();
export default centersController;
