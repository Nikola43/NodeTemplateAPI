import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import Config from "../config/Config";
import UserErrors from "../errors/UserErrors";
import ServerErrors from "../errors/ServerErrors";
import Messages from "../messages/Messages";
import {User} from "../db/models/User";
import {Op} from "sequelize";
import bcrypt from "bcrypt"

class AuthController {
    static login = async (req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;
        let user: User | null;

        // check if username are set
        // if not are set, then stop execution
        if (!username) {
            res.status(400).send(UserErrors.USERNAME_EMPTY_ERROR);
            return;
        }

        // check if username and password are set
        // if not are set, then stop execution
        if (!password) {
            res.status(400).send(UserErrors.PASSWORD_EMPTY_ERROR);
            return;
        }

        // find user on db
        try {
            user = await User.findOne({
                attributes: [
                    'id',
                    'username',
                    'password'
                ], where: {
                    username: {
                        [Op.eq]: username
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
                    {userId: user.id, username: user.username},
                    Config.jwtSecret,
                    {expiresIn: "24h"}
                );

                // clear user password and set token
                user.password = "";
                user.token = token;

                // update user token
                await User.update({token: token}, {
                    where: {
                        username: username
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
        // get username from JWT
        const username = res.locals.jwtPayload.username;

        // check if password are set
        if (!req.body.password) {
            res.status(400).send(UserErrors.PASSWORD_EMPTY_ERROR);
            return;
        }

        try {
            const user = await User.findOne({where: {username: username}});

            if (user) {
                //Generate new password
                const password = await bcrypt.hash(req.body.password, 10);

                //Update user token
                const updatedUser = await User.update({password: password}, {
                    where: {
                        username: username
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
