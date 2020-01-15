import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/Config";
import {User} from "../db/models/User";
import {Op} from "sequelize";
import bcrypt from "bcrypt"

class AuthController {
    static login = async (req: Request, res: Response) => {
        const username = req.body.username;
        const password = req.body.password;
        let user: User | null;

        //Check if username and password are set
        if (!(username && password)) {
            res.status(400).send({error: "username or password are empty"});
            return;
        }

        try {
            user = await User.findOne({
                attributes: [
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

            if (user) {

                //Check if encrypted password match
                if (await bcrypt.compare(password, user.password)) {
                    res.status(404).send({error: "user not found"});
                    return;
                }

                //Sing JWT, valid for 1 hour
                const token = jwt.sign(
                    {userId: user.id, username: user.username},
                    config.jwtSecret,
                    {expiresIn: "24h"}
                );

                //Send the jwt in the user
                user.password = "";
                user.token = token;

                //Update user token
                await User.update({token: token}, {
                    where: {
                        username: username
                    }
                });

                res.send(user);
            } else {
                res.status(404).send({error: "user not found"});
            }
        } catch (e) {
            res.status(500).send({error: "error accessing db data"});
        }


    };

    static changePassword = async (req: Request, res: Response) => {
        //Get username from JWT
        const username = res.locals.jwtPayload.username;

        //Check if password are set
        if (!(req.body.password)) {
            res.status(400).send({error: "password are empty"});
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
                    res.status(200).send({message: "success"});
                } else {
                    res.status(500).send({error: "error updating user password"});
                }
            } else {
                res.status(404).send({error: "user not found"});
            }
        } catch (e) {
            res.status(500).send({error: "error accessing db data"});
        }
    };
}

export default AuthController;
