import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import Config from "../config/Config";
import UserErrors from "../constants/errors/UserErrors";
import ServerErrors from "../constants/errors/ServerErrors";
import Messages from "../constants/messages/Messages";
import {UserModel} from "../db/models/UserModel";
import {Op} from "sequelize";
import bcrypt from "bcrypt"

class AuthController {
    static login = async (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        let user: UserModel | null;

        // check if email are set
        // if not are set, then stop execution
        if (!email) {
            res.status(400).send(UserErrors.USERNAME_EMPTY_ERROR);
            return;
        }

        // check if email and password are set
        // if not are set, then stop execution
        if (!password) {
            res.status(400).send(UserErrors.PASSWORD_EMPTY_ERROR);
            return;
        }

        // find user on db
        try {
            user = await UserModel.findOne({
                attributes: [
                    'id',
                    'email',
                    'password'
                ], where: {
                    email: {
                        [Op.eq]: email
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // check if user exists
            if (user) {

                // check if encrypted password match
                if (await bcrypt.compare(password, user.password)) {
                    res.status(404).send(UserErrors.USER_NOT_FOUND_ERROR);
                    return;
                }

                // create and sing JWT, valid for 1 hour
                const token = jwt.sign(
                    {userId: user.id, email: user.email},
                     Config.jwtSecret,
                    {expiresIn: "128h"}
                );

                // clear user password and set token
                user.password = "";
                user.token = token;

                // update user token
                await UserModel.update({token: token}, {
                    where: {
                        email: email
                    }
                });
                res.status(200).send(user);
            } else {
                res.status(404).send(UserErrors.USER_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    static changePassword = async (req: Request, res: Response) => {
        // get email from JWT
        const email = res.locals.jwtPayload.email;

        // check if password are set
        if (!req.body.password) {
            res.status(400).send(UserErrors.PASSWORD_EMPTY_ERROR);
            return;
        }

        try {
            const user = await UserModel.findOne({where: {email: email}});

            if (user) {
                //Generate new password
                const password = await bcrypt.hash(req.body.password, 10);

                //Update user token
                const updatedUser = await UserModel.update({password: password}, {
                    where: {
                        email: email
                    }
                });

                if (updatedUser) {
                    res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
                } else {
                    res.status(500).send({error: "error updating user password"});
                }
            } else {
                res.status(404).send(UserErrors.USER_NOT_FOUND_ERROR);
            }
        } catch (e) {
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };
}

export default AuthController;
