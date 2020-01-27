import {Request, Response} from "express";
import {CenterTypeModel} from "../db/models/CenterTypeModel";
import {LOGUtil} from "../utils/LOGUtil";
import {CenterModel} from "../db/models/CenterModel";
import BaseController from "./BaseController";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class CentersTypesController extends BaseController {
    getAll = async (req: Request, res: Response, next: any) => {
        try {
            const data = await CenterTypeModel.findAll();
            data ? res.status(200).send(data) : res.status(200).send([]);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all center type - " + e.toString());
            res.status(500).send({error: "Error en la petición"});
        }
    };

    getById = async (req: Request, res: Response, next: any) => {
        try {
            const data = await CenterTypeModel.findByPk(req.query.id);
            data ? res.status(200).send(data) : res.status(200).send({error: "data not found"});
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get center type by ID - " + e.toString());
            res.status(500).send({error: "Error en la petición"});
        }
    };

    insert = async (req: Request, res: Response, next: any) => {
        try {
            const newCenterType = await CenterTypeModel.create(req.body);
            res.status(200).send(newCenterType);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert center Type- " + e.toString());
            res.status(500).send({error: "Error insertando"});
        }
    };

    update = async (req: Request, res: Response, next: any) => {
        let data: CenterTypeModel = req.body;
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
            console.log(e);
            LOGUtil.saveLog("update center type - " + e.toString());
            res.status(500).send({error: "Error actualizando"});
        }
    };

    delete = async (req: Request, res: Response, next: any) => {
        let data: CenterTypeModel = req.body;
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
            res.status(200).send({success: "Tipo de centro eliminado"});
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete center type - " + e.toString());
            res.status(500).send({error: "Error eliminando"});
        }
    };
}
const centersTypesController = new CentersTypesController();
export default centersTypesController;
