import {LOGUtil} from "./LOGUtil";
import {Response} from "express";

export class ErrorUtil {

    constructor() {
    }

    public static handleError(res: Response, e: Error, message: string) {
        console.log(e);
        LOGUtil.saveLog(message+' - '+ e);
        res.status(500).send({error: "error accessing database"});
    }
}

