import {LOGUtil} from "./LOGUtil";
import {Response} from "express";
import ServerErrors from "../constants/errors/ServerErrors";

export class ErrorUtil {

    constructor() {
    }

    public static handleError(res: Response, e: Error, message: string) {
        console.log(e);
        LOGUtil.saveLog(message + '\r\n' + e);
        res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
    }
}

