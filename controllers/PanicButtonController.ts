import {Request, Response} from "express";
import {PanicButton} from "../db/models/PanicButton";
import ServerErrors from "../errors/ServerErrors";
import Messages from "../messages/Messages";
import PanicButtonErrors from "../errors/PanicButtonErrors";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

export default class PanicButtonController {
    static getAll = async (req: Request, res: Response, next: any) => {
        try {
            const panicButtons = await PanicButton.findAll();
            res.status(200).send(panicButtons);
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    static getPanicButtonById = async (req: Request, res: Response, next: any) => {
        try {
            const panicButton = await PanicButton.findByPk(req.params.id);

            if (panicButton) {
                res.status(200).send(panicButton);
            } else {
                res.status(404).send(PanicButtonErrors.PANIC_BUTTON_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send({error: "internal error"});
        }
    };

    static insertPanicButton = async (req: Request, res: Response, next: any) => {

        // get userID from request
        const userId = req.body.user_id;

        // check if userID are set
        // if not are set, break execution
        if (!userId) {
            res.status(400).send(PanicButtonErrors.USERID_EMPTY_ERROR);
            return;
        }

        // find user in db for check if already exists
        try {
            const tempPanicButton = await PanicButton.findOne({
                attributes: [
                    'user_id',
                ], where: {
                    endAt: {
                        [Op.is]: null
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // check if user already have panic button
            // break execution
            if (tempPanicButton) {
                res.status(400).send(PanicButtonErrors.USER_ALREADY_HAS_ASIGNED_PANIC_BUTTON_ERROR);
                return;
            } else {
                try {
                    // Create user from request data
                    const newPanicButton = await PanicButton.create({
                        user_id:userId
                    });

                    res.status(200).send(newPanicButton);
                } catch (e) {
                    console.log(e);
                    res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    static updatePanicButton = async (req: Request, res: Response, next: any) => {
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
            let panicButton: PanicButton = req.body;
            panicButton.updatedAt = new Date();

            const updatedPanicButton = await PanicButton.update(panicButton,
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
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    static deletePanicButton = async (req: Request, res: Response, next: any) => {
        // get userID from request
        const panicButtonId = req.params.id;

        // check if panicButtonId are set
        // if not are set, break execution
        if (!panicButtonId) {
            res.status(400).send(PanicButtonErrors.PANIC_BUTTON_ID_EMPTY_ERROR);
            return;
        }

        try {
            const panicButton = await PanicButton.update({deletedAt: new Date()},
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
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };
}
