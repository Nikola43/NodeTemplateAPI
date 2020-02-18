import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/Config";
import {UserModel} from "../db/models/UserModel";

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    let userToken = <string>req.headers['authorization'];
    let jwtPayload;

    //Try to validate the token and get data
    try {
        userToken = userToken.replace('Bearer ', '');
        jwtPayload = <any>jwt.verify(userToken, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;


        const queryResult = await UserModel.findOne({
            where: {
                id: jwtPayload.id,
                token: userToken
            }
        });

        if (queryResult) {
            //The token is valid for 1 hour
            //We want to send a new token on every request
            const {userId, email} = jwtPayload;
            const newToken = jwt.sign({userId, email}, config.jwtSecret, {
                expiresIn: "168h"
            });

            //Update user token
            await UserModel.update({token: newToken}, {
                where: {
                    email: email
                }
            });

            // set new token in header
            res.setHeader("token", newToken);

            //Call the next middleware or controller
            next();
        } else {
            //If token is not valid, respond with 401 (unauthorized)
            res.status(401).send({error: "unauthorized"});
        }
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send({error: "unauthorized"});
        return;
    }


};
