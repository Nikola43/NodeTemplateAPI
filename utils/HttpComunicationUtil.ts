import DBActions from "../constants/DBActions";
import socketManager from "../managers/SocketManager";
import {ErrorUtil} from "./ErrorUtil";
import {Response} from "express";
import GenericErrors from "../constants/errors/GenericErrors";
import Messages from "../constants/messages/Messages";

const HttpStatus = require('http-status-codes');

export class HttpComunicationUtil {
    static respondInsertRequest(controller: any, model: any, queryResult: any, res: Response) {
        // if result is model instance, then
        if (queryResult instanceof model) {
            // emit inserted model
            socketManager.emitSocketEvent(model.name, DBActions.INSERT, queryResult);

            // respond request
            res.status(HttpStatus.CREATED).send(queryResult);
        } else {
            ErrorUtil.handleError(res, queryResult, controller.name + ' - ' + DBActions.GET_BY_ID);
        }
    }

    static respondUpdateRequest = async (controller: any, model: any, queryResult: any, modelId: number, res: Response) => {
        // check if model is updated
        try {
            // if it has one affected row
            if (queryResult[0] === 1) {

                // find updated data
                const result = await model.findByPk(modelId);

                // emit updated data
                socketManager.emitSocketEvent(model.name, DBActions.UPDATE, result);

                // respond request
                res.status(HttpStatus.OK).send(result);
            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: model.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, controller.name + ' - ' + DBActions.UPDATE)
        }
    };

    static respondDeleteRequest = async (controller: any, model: any, queryResult: any, modelId: number, res: Response) => {
        // check if model is updated
        try {
            // if it has one affected row
            if (queryResult[0] === 1) {

                // find updated data
                const result = await model.findByPk(modelId);

                // emit updated data
                socketManager.emitSocketEvent(model.name, DBActions.UPDATE, result);

                // respond request
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: model.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, controller.name + ' - ' + DBActions.UPDATE)
        }
    };

    static respondLogOutRequest = async (controller: any, model: any, queryResult: any, modelId: number, res: Response) => {
        // check if model is updated
        try {
            // if it has one affected row
            if (queryResult[0] === 1) {

                // find updated data
                const result = await model.findByPk(modelId);

                // emit updated data
                socketManager.emitSocketEvent(model.name, DBActions.LOGOUT, result);

                // respond request
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: model.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, controller.name + ' - ' + DBActions.LOGOUT)
        }
    }
}

