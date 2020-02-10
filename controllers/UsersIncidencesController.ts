import {Request, Response} from "express";
import UserIncidenceErrors from "../constants/errors/UserErrors";
import {UserIncidenceModel} from "../db/models/UserIncidenceModel";
import ServerErrors from "../constants/errors/ServerErrors";
import Messages from "../constants/messages/Messages";
import {LOGUtil} from "../utils/LOGUtil";



const Sequelize = require('sequelize');
const Op = Sequelize.Op;

export default class UserIncidenceController {
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

     getUserIncidenceById = async (req: Request, res: Response, next: any) => {
        try {
            const userIncidence = await UserIncidenceModel.findByPk(req.params.id);
            console.log(req.params.id);

            if (userIncidence) {
                res.status(200).send(userIncidence);
            } else {
                res.status(404).send(UserIncidenceErrors.USER_INCIDENCE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get user incidence by ID - " + e.toString());
            res.status(500).send({error: "internal error"});
        }
    };

     insertResource = async (req: Request, res: Response, next: any) => {

        // get userIncidence data from request
        const userId = req.body.user_id;
        const incidenceId = req.body.incidence_id;

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

        // find userIncidence in db for check if already exists
        try {
            const tempResource = await UserIncidenceModel.findOne({
                attributes: [
                    'user_id',
                    'incidence_id',
                ], where: {
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
            if (tempResource) {
                res.status(400).send(UserIncidenceErrors.USER_INCIDENCE_ALREADY_EXIST_ERROR);
                return;
            } else {

                const newUserIncidenceData: UserIncidenceModel = req.body;

                try {
                    // Create userIncidence from request data
                    const newUserIncidence = await UserIncidenceModel.create(newUserIncidenceData);

                    res.status(200).send(newUserIncidence);
                } catch (e) {
                    console.log(e);
                    res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert user incidence - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

     updateResource = async (req: Request, res: Response, next: any) => {
        // get userIncidenceID from request
        const userIncidenceId = req.params.id;

        // check if resourceId are set
        // if not are set, break execution
        if (!userIncidenceId) {
            res.status(400).send(UserIncidenceErrors.USER_INCIDENCE_ID_EMPTY_ERROR);
            return;
        }

        try {
            // create userIncidence from request data
            let userIncidence: UserIncidenceModel = req.body;
            userIncidence.updatedAt = new Date();

            const updatedUserIncidence = await UserIncidenceModel.update(userIncidence,
                {
                    where: {
                        id: {
                            [Op.eq]: userIncidenceId
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });

            // check if userIncidence are updated
            if (updatedUserIncidence[0] === 1) {
               res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
               //res.status(200).send(updatedUserIncidence);

            } else {
                res.status(404).send(UserIncidenceErrors.USER_INCIDENCE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update user incidence - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

     deleteResource = async (req: Request, res: Response, next: any) => {
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
    validateInsert = (data: any, req: Request, res: Response, next: Function): boolean => {
        return true;
    };

    checkIfExists = async (data: any, req: Request, res: Response, next: Function): Promise<boolean> => {
        return true;
    };
}
