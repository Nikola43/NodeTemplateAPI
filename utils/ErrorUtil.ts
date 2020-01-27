import {LOGUtil} from "./LOGUtil";
import {Response} from "express";

export class ErrorUtil {

    constructor() {
    }

    public static handleError(e: Error, message: string) {
        console.log(e);
        LOGUtil.saveLog(message + '\r\n' + e);
    }
}

