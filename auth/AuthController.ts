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
                        {userId: tempUser.id, email: tempUser.email},
                        Config.jwtSecret,
                        {expiresIn: "128h"}
                    );

                    // clear user password and set token
                    tempUser.password = "";
                    tempUser.token = token;

                    // update user token
                    await UserModel.update({token: token}, {
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
}

export default AuthController;
