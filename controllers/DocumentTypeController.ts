import { Request, Response } from "express";
import { DocumentTypeModel } from "../db/models/DocumentTypeModel";
import {LOGUtil} from "../utils/LOGUtil";
const Sequelize = require('sequelize');
const Op = Sequelize.Op


export default class DocumentsTypesController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let documentsTypes = null;
        try {
            documentsTypes = await DocumentTypeModel.findAll()
            if (documentsTypes) {
                res.status(200).send(documentsTypes);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all document type - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static getDocumentTypeById = async (req: Request, res: Response, next: any) => {
        let documentType = null;
        try {
            const documentType = await DocumentTypeModel.findByPk(req.query.id)
            if (documentType) {
                res.status(200).send(documentType);
            } else {
                res.status(200).send({ error: "documentType not found" });
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get document type - " + e.toString());
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertDocumentType = async (req: Request, res: Response, next: any) => {
        let newDocumentType = null;
        try {
            const newDocument = await DocumentTypeModel.create({
                type: req.body.type
            });
            res.status(200).send(newDocument);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert document type - " + e.toString());
            res.status(500).send({ error: "Error insertando" });
        }
    };

    static updateDocumentType = async (req: Request, res: Response, next: any) => {
        let documentType: DocumentTypeModel = req.body;
        documentType.id = req.query.id;
        documentType.updatedAt = new Date();
        try {
            documentType.update(documentType,
                {
                    where: {
                        id: {
                            [Op.eq]: documentType.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(documentType);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update document type - " + e.toString());
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteDocumentType = async (req: Request, res: Response, next: any) => {
        let documentType: DocumentTypeModel = req.body;
        documentType.id = req.query.id;
        try {
            documentType.update({
                deletedAt: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: documentType.id
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Tipo de documento eliminado" });
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete document type - " + e.toString());
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
