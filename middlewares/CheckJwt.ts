import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/Config";
import {UserModel} from "../db/models/UserModel";
import GenericConstants from "../constants/GenericConstants";
const HttpStatus = require('http-status-codes');

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    let token: string = <string>req.headers['authorization'];
    let newToken: string;

    //Try to validate the token and get data
    try {
        // remove Bearer prefix
        token = token.replace('Bearer ', '');

        // verify token and save it on response
        res.locals.jwtPayload = <any>jwt.verify(token, config.jwtSecret);

        //The token is valid for 1 week
        //We want to send a new token on every request
        const {userId, email} = res.locals.jwtPayload;
        newToken = jwt.sign({userId, email}, config.jwtSecret, {
            expiresIn: GenericConstants.TOKEN_TIME_EXPIRATION
        });

        //Update user token on db
        await UserModel.update({token: newToken}, {
            where: {
                userId: userId
            }
        });
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(HttpStatus.UNAUTHORIZED).send({error: "unauthorized"});
        return;
    }


    // set new token in header
    res.setHeader("token", newToken);

    //Call the next middleware or controller
    next();
};
