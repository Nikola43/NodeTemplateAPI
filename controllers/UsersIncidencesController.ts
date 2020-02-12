import {Request, Response} from "express";
import UserIncidenceErrors from "../constants/errors/UserErrors";
import {UserIncidenceModel} from "../db/models/UserIncidenceModel";
import ServerErrors from "../constants/errors/ServerErrors";
import Messages from "../constants/messages/Messages";
import {LOGUtil} from "../utils/LOGUtil";
import BaseController from "./BaseController";
import GenericErrors from "../constants/errors/GenericErrors";
import {CenterModel} from "../db/models/CenterModel";
import {DBUtil} from "../utils/DBUtil";
import {HttpComunicationUtil} from "../utils/HttpComunicationUtil";
import {IncidenceModel} from "../db/models/IncidenceModel";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class UsersIncidencesController extends BaseController {
     getAll = async (req: Request, res: Response, next: any) => {
        try {
            const userIncidence = await UserIncidenceModel.findAll();
            res.status(200).send(userIncidence);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all user incidence - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

     getById = async (req: Request, res: Response, next: any) => {

         const userId= req.params.user_id;
         const incidenceId= req.params.incidence_id;

         // check if centerID are set
         // if not are set, break execution
         if (!userId) {
             res.status(400).send(UserIncidenceErrors.USER_ID_EMPTY_ERROR);
             return;
         }

         if (!incidenceId) {
             res.status(400).send(UserIncidenceErrors.INCIDENCE_ID_EMPTY_ERROR);
             return;
         }
         try {
             const data = await UserIncidenceModel.findOne({
                  where: {
                     user_id: {
                         [Op.eq]: userId
                     },
                     incidence_id: {
                         [Op.eq]: incidenceId
                     },
                     deletedAt: {
                         [Op.is]: null
                     }
                 }
             });

             // check if userIncidence already have center
             // break execution
             if (data) {
                 res.status(200).send(data);
                 return;
             } else {
                 res.status(404).send(GenericErrors.NOT_FOUND_ERROR);
             }
         } catch (e) {
             console.log(e);
             LOGUtil.saveLog("insert user incidence - " + e.toString());
             res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
         }

     };


     insert = async (req: Request, res: Response, next: any) => {
         // create model from request body data
         const data: UserIncidenceModel= req.body;

         if (this.validateInsert(data, res)) {
             const estaAsignaodo = await DBUtil.checkIfUserIsAsignedToAnIncidence(this, UserIncidenceModel, data.user_id);
             if (estaAsignaodo) {
                 res.status(409).send("ya esta asiganod");
             } else {



                 // insert
                 const result = await DBUtil.insertModel(this, UserIncidenceModel, data);

                 // respond request
                 HttpComunicationUtil.respondInsertRequest(this, UserIncidenceModel, result, res);

             }

         } else {
             //res.status(400).send("mal");

         }

         /*

         // check if request is valid and if user doesn't exists
         if (this.validateInsert(data, res)
             && !await DBUtil.checkIfExistsByField(this, UserIncidenceModel, 'user_id', data.user_id) && !await DBUtil.checkIfExistsByField(this, UserIncidenceModel, 'incidence_id', data.incidence_id)) {

             // insert
             const result = await DBUtil.insertModel(this, UserIncidenceModel, data);

             // respond request
             HttpComunicationUtil.respondInsertRequest(this, UserIncidenceModel, result, res);
         }
         */

    };
    update = async (req: Request, res: Response, next: any) => {};

     delete = async (req: Request, res: Response, next: any) => {
        // get userIncidenceID from request
        const userIncidenceId = req.params.id;

        // check if resourceId are set
        // if not are set, break execution
        if (!userIncidenceId) {
            res.status(400).send(UserIncidenceErrors.USER_INCIDENCE_ID_EMPTY_ERROR);
            return;
        }

        try {
            const userIncidence = await UserIncidenceModel.update({deletedAt: new Date()},
                {
                    where: {
                        id: {
                            [Op.eq]: userIncidenceId
                        },
                        deletedAt: {
                            [Op.eq]: null
                        }
                    }
                });

            // check if userIncidence are deleted
            if (userIncidence[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(404).send(UserIncidenceErrors.USER_INCIDENCE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete user incidence - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };
    validateInsert = (data: any, res: Response): boolean => {
        // check if centerID are set
        // if not are set, break execution
        if (!data.user_id) {
            res.status(400).send(UserIncidenceErrors.USER_ID_EMPTY_ERROR);
            return false;
        }

        if (!data.incidence_id) {
            res.status(400).send(UserIncidenceErrors.INCIDENCE_ID_EMPTY_ERROR);
            return false;
        }
        return true;
    };
}
const userIncidenceController = new UsersIncidencesController();
export default userIncidenceController;
