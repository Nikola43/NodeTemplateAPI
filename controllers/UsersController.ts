import {Request, Response} from "express";
import {UserModel} from "../db/models/UserModel";
import BaseController from "./BaseController";
import {ErrorUtil} from "../utils/ErrorUtil";
import Messages from "../constants/messages/Messages";
import UserErrors from "../constants/errors/UserErrors";
import server from "../server";
import GenericErrors from "../constants/errors/GenericErrors";
import DBActions from "../constants/DBActions";
import bcrypt from "bcrypt";
import { DocumentModel } from "../db/models/DocumentModel";
import { MultimediaContentModel } from "../db/models/MultimediaContentModel";
import { UserDeviceModel } from "../db/models/UserDeviceModel";
import { UserResourceModel } from "../db/models/UserResourceModel";
import { UserIncidenceModel } from "../db/models/UserIncidenceModel";
import MailUtil from "../utils/MailUtil";

const HttpStatus = require('http-status-codes');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class UsersController extends BaseController {
    // functions
    // GET ALL
    getAll = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find all records
        try {
            queryResult = await UserModel.findAll({
                where: {
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // if has results, then send result data
            // if not has result, send empty array
            queryResult
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.OK).send([]);
        } catch (e) {
            ErrorUtil.handleError(res, e, UsersController.name + ' - ' + DBActions.GET_ALL)
        }
    };

    // GET BY ID
    getById = async (req: Request, res: Response, next: Function) => {

        // create variable for store query result
        let queryResult: any;

        // find record by pk
        try {
            queryResult = await UserModel.findByPk(req.params.id,{
                include:[
                    {model: DocumentModel, as: 'Documents'},
                    {model: MultimediaContentModel, as: 'Multimedia'},
                    {model: UserDeviceModel, as: 'Devices'},
                    {model: UserResourceModel, as: 'Resources'},
                    {model: UserIncidenceModel, as: 'Incidences'}
                ]
            });

            // if has results, then send result data
            // if not has result, send not found error
            queryResult && !queryResult.deletedAt
                ? res.status(HttpStatus.OK).send(queryResult)
                : res.status(HttpStatus.NOT_FOUND).send({error: UserModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
        } catch (e) {
            ErrorUtil.handleError(res, e, UsersController.name + ' - ' + DBActions.GET_BY_ID)
        }
    };

    // INSERT
    insert = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: UserModel = req.body;
        let tempData: any;

        // check if field callet 'password' are set
        // if field not are set, then send empty required field error
        if (!data.password) {
            res.status(HttpStatus.BAD_REQUEST).send({error: UserModel.name + " " + UserErrors.PASSWORD_EMPTY_ERROR});
            return;
        }

        // check if field callet 'email' are set
        // if field not are set, then send empty required field error
        if (!data.email) {
            res.status(HttpStatus.BAD_REQUEST).send({error: UserModel.name + " " + UserErrors.EMAIL_EMPTY_ERROR});
            return;
        }

        // find if exists any record with same request value in type field
        try {
            tempData = await UserModel.findOne({
                attributes: [
                    'email',
                ], where: {
                    email: {
                        [Op.eq]: data.email
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // if already exist
            // send conflict error
            if (tempData) {
                res.status(HttpStatus.CONFLICT).send({error: UserModel.name + " " + GenericErrors.ALREADY_EXIST_ERROR});
                return;
            } else {
                //Generate new password
                let passwordCopy = data.password;
                data.password = await bcrypt.hashSync(data.password, 10);

                // create new record from request body data
                const newData = await UserModel.create(data);

                // emit new data
                server.io.emit('UserDBEvent', {
                    modelName: 'ignorar',
                    action: DBActions.INSERT,
                    data: newData
                });



                MailUtil.to = data.email;
                MailUtil.subject = 'Bienvenido a Signis';
                MailUtil.message = `<h1 style="color: red">Su contraseña es: ${passwordCopy}</h1>`;
                let result = MailUtil.sendMail();
                console.log(result);

                // clear password before send
                newData.password = "";

                // respond request
                res.status(HttpStatus.CREATED).send(newData)
            }
        } catch (e) {
            ErrorUtil.handleError(res, e, UsersController.name + ' - ' + DBActions.INSERT);
        }
    };

    // UPDATE
    update = async (req: Request, res: Response, next: Function) => {
        // create model from request body data
        const data: UserModel = req.body;

        // get record id(pk) from request params
        data.id = Number(req.params.id);

        // set updated date
        data.updatedAt = new Date();

        // update
        try {
            const updateResult = await UserModel.update(data,
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

            // if it has affected one row
            if (updateResult[0] === 1) {

                // find updated data
                const updatedData = await UserModel.findByPk(data.id);

                // emit updated data
                server.io.emit('UserDBEvent', {
                    modelName: 'ignorar',
                    action: DBActions.UPDATE,
                    data: updatedData
                });

                // respond request
                res.status(HttpStatus.OK).send(updatedData);

            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: UserModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, UsersController.name + ' - ' + DBActions.UPDATE);
        }
    };

    // DELETE
    delete = async (req: Request, res: Response, next: Function) => {

        // create model from request body data
        const data: UserModel = req.body;

        // get record id(pk) from request params
        data.id = Number(req.params.id);

        // set deleted date
        data.deletedAt = new Date();

        // delete
        try {
            const deleteResult = await UserModel.update(data,
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

            // if it has affected one row
            if (deleteResult[0] === 1) {
                // emit updated data
                server.io.emit('UserDBEvent', {
                    modelName: 'ignorar',
                    action: DBActions.DELETE,
                    data: {id: data.id}
                });

                // respond request
                res.status(HttpStatus.OK).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(HttpStatus.NOT_FOUND).send({error: UserModel.name + " " + GenericErrors.NOT_FOUND_ERROR});
            }

        } catch (e) {
            ErrorUtil.handleError(res, e, UsersController.name + ' - ' + DBActions.DELETE)
        }
    };
}

const usersController = new UsersController();
export default usersController;
