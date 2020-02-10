import {Request, Response} from "express";

export default abstract class BaseController {
    // functions
    abstract getAll = async (req: Request, res: Response, next: Function) => {
    };

    abstract getById = async (req: Request, res: Response, next: Function) => {
    };

    abstract insert = async (req: Request, res: Response, next: Function) => {
    };

    abstract update = async (req: Request, res: Response, next: Function) => {
    };

    abstract delete = async (req: Request, res: Response, next: Function) => {
    };

    abstract validateInsert = (data: any, res: Response): boolean => {
        return false;
    };

    abstract respondInsertRequest = (result: any, res: Response) => {
    };

    abstract respondUpdateRequest = async (result: any, modelId: number, res: Response) => {
    };

    abstract respondDeleteRequest = async (result: any, modelId: number, res: Response) => {
    };
}
