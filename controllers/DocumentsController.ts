import {Request, Response} from "express";
import { DocumentModel } from "../db/models/DocumentModel";
import {LOGUtil} from "../utils/LOGUtil";
import BaseController from "./BaseController";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class DocumentsController extends BaseController {
     getAll = async (req: Request, res: Response, next: any) => {
        let documents = null;
        try {
            documents = await DocumentModel.findAll()
            if (documents) {
                res.status(200).send(documents);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all documents - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

     getById = async (req: Request, res: Response, next: any) => {
        let document = null;
        try {
            const document = await DocumentModel.findByPk(req.params.id);
            if (document) {
                res.status(200).send(document);
            } else {
                res.status(200).send({ error: "document not found" });
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get document by id - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

     insert = async (req: Request, res: Response, next: any) => {
        //
        let document: DocumentModel = req.body;
        try {
            const newDocument = await DocumentModel.create(document);
            res.status(200).send(newDocument);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert document - " + e.toString());
            res.status(500).send({ error: "Error insertando" });
        }
    };

     update = async (req: Request, res: Response, next: any) => {
        let document: DocumentModel = req.body;
        document.id = req.query.id;
        document.updatedAt = new Date();
        try {
            document.update(document,
                {
                    where: {
                        id: {
                            [Op.eq]: document.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(document);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update document - " + e.toString());
            res.status(500).send({ error: "Error actualizando" });
        }
    };

     delete = async (req: Request, res: Response, next: any) => {
        let document: DocumentModel = req.body;
        document.id = req.query.id;
        try {
            document.update({
                deletedAt: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: document.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Documento eliminado" });
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete document - " + e.toString());
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}

const documentsController = new DocumentsController();
export default documentsController;
