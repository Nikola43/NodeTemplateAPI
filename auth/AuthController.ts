import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import Config from "../config/Config";
import UserErrors from "../constants/errors/UserErrors";
import ServerErrors from "../constants/errors/ServerErrors";
import Messages from "../constants/messages/Messages";
import {UserModel} from "../db/models/UserModel";
import {Op} from "sequelize";
import bcrypt from "bcrypt"
import * as EmailValidator from "email-validator";
import config from "../config/Config";
import {DBUtil} from "../utils/DBUtil";
import {CenterModel} from "../db/models/CenterModel";
import DBActions from "../constants/DBActions";
import {HttpComunicationUtil} from "../utils/HttpComunicationUtil";

const HttpStatus = require('http-status-codes');


class AuthController {
    static login = async (req: Request, res: Response) => {
        let user: UserModel = req.body;

        // check if email are set
        // if not are set, then stop execution
        if (!user.email) {
            res.status(400).send(UserErrors.EMPTY_USERNAME_ERROR);
            return;
        }

        // check if email and password are set
        // if not are set, then stop execution
        if (!user.password) {
            res.status(400).send(UserErrors.EMPTY_PASSWORD_ERROR);
            return;
        }

        // check if field callet 'email' are set
        // if field not are set, then send empty required field error
        if (!EmailValidator.validate(user.email)) {
            res.status(HttpStatus.BAD_REQUEST).send({error: UserModel.name + " " + UserErrors.INVALID_EMAIL_ERROR});
            return;
        }

        // find user on db
        try {
            const tempUser = await UserModel.findOne({
                where: {
                    email: {
                        [Op.eq]: user.email
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // check if user exists
            if (tempUser) {

                // check if encrypted password match
                if (await bcrypt.compare(user.password, tempUser.password)) {

                    // create and sing JWT, valid for 1 hour
                    const token = jwt.sign(
                        {id: tempUser.id, email: tempUser.email},
                        Config.jwtSecret,
                        {expiresIn: "128h"}
                    );

                    console.log(token);

                    // clear user password and set token
                    tempUser.password = "";
                    tempUser.token = token;
                    tempUser.status = true;
                    tempUser.availability = 1;


                    // update user token
                    await UserModel.update({
                            token: token,
                            status: true,
                            availability: 1,
                        },
                        {
                            where: {
                                email: tempUser.email
                            }
                        });

                    res.status(200).send(tempUser);
                } else {
                    res.status(404).send(UserErrors.USER_NOT_FOUND_ERROR);
                    return;
                }
            } else {
                res.status(404).send(UserErrors.USER_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    static logout = async (req: Request, res: Response) => {
        let token = <string>req.headers['authorization'];
        let jwtPayload;

        //Try to validate the token and get data
        try {
            token = token.replace('Bearer ', '');
            jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        } catch (error) {
            //If token is not valid, respond with 401 (unauthorized)
            res.status(401).send({error: "unauthorized"});
            return;
        }

        const user = {
            id: jwtPayload.id,
            email: jwtPayload.email,
            token: '',
            status: false,
            availability: 0
        };

        const result = await DBUtil.updateModel('AuthController', UserModel, user, DBActions.UPDATE);

        await HttpComunicationUtil.respondLogOutRequest('AuthController', UserModel, result, user.id, res);
    };
}

export default AuthController;
