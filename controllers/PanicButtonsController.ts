import {Request, Response} from "express";
import {PanicButtonModel} from "../db/models/PanicButtonModel";
import ServerErrors from "../constants/errors/ServerErrors";
import Messages from "../constants/messages/Messages";
import PanicButtonErrors from "../constants/errors/PanicButtonErrors";
import {LOGUtil} from "../utils/LOGUtil";
import {CenterModel} from "../db/models/CenterModel";
import BaseController from "./BaseController";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class PanicButtonsController extends BaseController {
    getAll = async (req: Request, res: Response, next: any) => {
        try {
            const panicButtons = await PanicButtonModel.findAll();
            res.status(200).send(panicButtons);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all panic button - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    getById = async (req: Request, res: Response, next: any) => {
        try {
            const panicButton = await PanicButtonModel.findByPk(req.params.id);

            if (panicButton) {
                res.status(200).send(panicButton);
            } else {
                res.status(404).send(PanicButtonErrors.PANIC_BUTTON_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get panic button by id - " + e.toString());
            res.status(500).send({error: "internal error"});
        }
    };

    insert = async (req: Request, res: Response, next: any) => {

        let panicButton: PanicButtonModel = req.body;

        // check if userID are set
        // if not are set, break execution
        if (!panicButton.user_id) {
            res.status(400).send(PanicButtonErrors.USERID_EMPTY_ERROR);
            return;
        }

        // find user in db for check if already exists
        try {
            const tempPanicButton = await PanicButtonModel.findOne({
                attributes: [
                    'user_id',
                ], where: {
                    endAt: {
                        [Op.is]: null
                    },
                    user_id: {
                        [Op.eq]: panicButton.user_id
                    }
                }
            });

            // check if user already have panic button
            // break execution
            if (tempPanicButton) {
                res.status(409).send(PanicButtonErrors.USER_ALREADY_HAS_ASIGNED_PANIC_BUTTON_ERROR);
                return;
            } else {
                try {
                    // Create user from request data
                    const newPanicButton = await PanicButtonModel.create(panicButton);
                    res.status(200).send(newPanicButton);
                } catch (e) {
                    console.log(e);
                    LOGUtil.saveLog("insert panic button - " + e.toString());
                    res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert panic button  - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    update = async (req: Request, res: Response, next: any) => {
        // get userID from request
        const panicButtonId = req.params.id;

        // check if panicButtonId are set
        // if not are set, break execution
        if (!panicButtonId) {
            res.status(400).send(PanicButtonErrors.PANIC_BUTTON_ID_EMPTY_ERROR);
            return;
        }

        try {
            // create user from request data
            let panicButton: PanicButtonModel = req.body;
            panicButton.updatedAt = new Date();

            const updatedPanicButton = await PanicButtonModel.update(panicButton,
                {
                    where: {
                        id: {
                            [Op.eq]: panicButtonId
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });

            // check if user are updated
            if (updatedPanicButton[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
                //res.status(200).send(updatedPanicButton);

            } else {
                res.status(404).send(PanicButtonErrors.PANIC_BUTTON_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update panic button - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    delete = async (req: Request, res: Response, next: any) => {
        // get userID from request
        const panicButtonId = req.params.id;

        // check if panicButtonId are set
        // if not are set, break execution
        if (!panicButtonId) {
            res.status(400).send(PanicButtonErrors.PANIC_BUTTON_ID_EMPTY_ERROR);
            return;
        }

        try {
            const panicButton = await PanicButtonModel.update({deletedAt: new Date()},
                {
                    where: {
                        id: {
                            [Op.eq]: panicButtonId
                        },
                        deletedAt: {
                            [Op.eq]: null
                        }
                    }
                });

            // check if user are deletd
            if (panicButton[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(404).send(PanicButtonErrors.PANIC_BUTTON_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete panic button - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };
}
const panicButtonsController = new PanicButtonsController();
export default panicButtonsController;
