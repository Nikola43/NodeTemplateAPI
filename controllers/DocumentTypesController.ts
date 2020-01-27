import {Request, Response} from "express";
import {DocumentTypeModel} from "../db/models/DocumentTypeModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import DocumentTypeErrors from "../errors/DocumentTypeErrors";
import Messages from "../messages/Messages";


const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class DocumentsTypesController extends BaseController {
    getAll = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await DocumentTypeModel.findAll();
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get all document type');
        }
    };

    getById = async (req: Request, res: Response, next: Function) => {
        try {
            const data = await DocumentTypeModel.findByPk(req.params.id);
            data ? res.status(HttpStatus.OK).send(data) : res.status(HttpStatus.NOT_FOUND).send({error: "document type not found"});
        } catch (e) {
            ErrorUtil.handleError(res, e, 'get document type by id');
        }
    };

    insert = async (req: Request, res: Response, next: Function) => {
        // get document from request
        const data: DocumentTypeModel = req.body;

        // check if type id are set
        if (!data.type) {
            res.status(HttpStatus.BAD_REQUEST).send(DocumentTypeErrors.DOCUMENT_TYPE_ID_EMPTY_ERROR);
            return;
        }

        try {
            const tempDocument = await DocumentTypeModel.findOne({
                attributes: [
                    'type',
                ], where: {
                    type: {
                        [Op.eq]: data.type
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // check if device already exist
            if (tempDocument) {
                res.status(HttpStatus.CONFLICT).send(DocumentTypeErrors.DOCUMENT_TYPE_ALREADY_EXIST_ERROR);
                return;
            } else {
                // Create document from request data
                res.status(HttpStatus.CREATED).send(await DocumentTypeModel.create(data))
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, 'insert document type');
        }
    };

    update = async (req: Request, res: Response, next: Function) => {
        let data: DocumentTypeModel = req.body;
        data.id = Number(req.params.id);
        data.updatedAt = new Date();

        // update
        try {
            const updatedData = await DocumentTypeModel.update(data,
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
            if (updatedData[0] === 1) {
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send(DocumentTypeErrors.DOCUMENT_TYPE_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'update document type');
        }
    };

    delete = async (req: Request, res: Response, next: Function) => {
        // create model from request data
        const data: DocumentTypeModel = req.body;
        data.id = Number(req.params.id);
        data.deletedAt = new Date();

        // update
        try {
            const updatedData = await DocumentTypeModel.update(data,
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
            if (updatedData[0] === 1) {
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send(DocumentTypeErrors.DOCUMENT_TYPE_NOT_FOUND_ERROR);
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, 'deleted document type');
        }
    };
}

const documentsTypesController = new DocumentsTypesController();
export default documentsTypesController;
