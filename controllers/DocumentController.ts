import { Request, Response } from "express";
import { DocumentModel } from "../db/models/DocumentModel";
const Sequelize = require('sequelize');
const Op = Sequelize.Op


export default class DocumentsController {
    static getAll = async (req: Request, res: Response, next: any) => {
        let documents = null;
        try {
            documents = await DocumentModel.findAll()
            if (documents) {
                res.status(200).send(documents);
            } else {
                res.status(200).send([]);
            }
        } catch (e) {
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static getDocumentById = async (req: Request, res: Response, next: any) => {
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
            res.status(500).send({ error: "Error en la petición" });
        }
    };

    static insertDocument = async (req: Request, res: Response, next: any) => {
        let newDocument = null;
        try {
            const newDocument = await DocumentModel.create({
                user_id: req.body.user_id,
                type_id: req.body.type_id,
                name: req.body.name,
                description: req.body.description,
                url: req.body.url,
                end_at: req.body.end_at
            });
            res.status(200).send(newDocument);
        } catch (e) {
            res.status(500).send({ error: "Error insertando" });
        }
    };

    static updateDocument = async (req: Request, res: Response, next: any) => {
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
                        deleted_at: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send(document);
        } catch (e) {
            res.status(500).send({ error: "Error actualizando" });
        }
    };

    static deleteDocument = async (req: Request, res: Response, next: any) => {
        let document: DocumentModel = req.body;
        document.id = req.query.id;
        try {
            document.update({
                deleted_at: new Date()
            },
                {
                    where: {
                        id: {
                            [Op.eq]: document.id
                        },
                        deleted_at: {
                            [Op.is]: null
                        }
                    }
                });
            res.status(200).send({ success: "Documento eliminado" });
        } catch (e) {
            res.status(500).send({ error: "Error eliminando" });
        }
    };
}
