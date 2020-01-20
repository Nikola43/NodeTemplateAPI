import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/Config";
import {User} from "../db/models/User";

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    let token = <string>req.headers['authorization'];
    token = token.replace('Bearer ', '');
    let jwtPayload;

    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send({error: "unauthorized"});
        return;
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const {userId, username} = jwtPayload;
    const newToken = jwt.sign({userId, username}, config.jwtSecret, {
        expiresIn: "24h"
    });


    //Update user token
    await User.update({token: newToken}, {
        where: {
            username: username
        }
    });

    // set new token in header
    res.setHeader("token", newToken);

    //Call the next middleware or controller
    next();
};
