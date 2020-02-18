import {Request, Response} from "express";
import UserResourceErrors from "../constants/errors/UserErrors";
import {UserResourceModel} from "../db/models/UserResourceModel";
import ServerErrors from "../constants/errors/ServerErrors";
import Messages from "../constants/messages/Messages";
import {LOGUtil} from "../utils/LOGUtil";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class UsersResourcesController {
    getAll = async (req: Request, res: Response, next: any) => {
        try {
            const userResource = await UserResourceModel.findAll();
            res.status(200).send(userResource);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all user resource - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    getById = async (req: Request, res: Response, next: any) => {
        try {
            const userResource = await UserResourceModel.findByPk(req.params.id);
            console.log(`HOLAA`);

            if (userResource) {
                res.status(200).send(userResource);
            } else {
                res.status(404).send(UserResourceErrors.USER_RESOURCE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get user resource by ID - " + e.toString());
            res.status(500).send({error: "internal error"});
        }
    };

    insert = async (req: Request, res: Response, next: any) => {

        // get userResource data from request
        const userId = req.body.user_id;
        const resourceId = req.body.resource_id;

        // check if centerID are set
        // if not are set, break execution
        if (!userId) {
            res.status(400).send(UserResourceErrors.USER_ID_EMPTY_ERROR);
            return;
        }

        if (!resourceId) {
            res.status(400).send(UserResourceErrors.RESOURCE_ID_EMPTY_ERROR);
            return;
        }

        // find userResource in db for check if already exists
        try {
            const tempResource = await UserResourceModel.findOne({
                attributes: [
                    'resource_id',
                ], where: {
                    resource_id: {
                        [Op.eq]: resourceId
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // check if userResource already have center
            // break execution
            if (tempResource) {
                res.status(400).send(UserResourceErrors.USER_RESOURCE_ALREADY_EXIST_ERROR);
                return;
            } else {

                const newUserResourceData: UserResourceModel = req.body;

                try {
                    // Create userResource from request data
                    const newUserResource = await UserResourceModel.create(newUserResourceData);

                    res.status(200).send(newUserResource);
                } catch (e) {
                    console.log(e);
                    LOGUtil.saveLog("insert user resource - " + e.toString());
                    res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert user resource - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    update = async (req: Request, res: Response, next: any) => {
        // get userResourceID from request
        const userResourceId = req.params.id;

        // check if resourceId are set
        // if not are set, break execution
        if (!userResourceId) {
            res.status(400).send(UserResourceErrors.USER_RESOURCE_ID_EMPTY_ERROR);
            return;
        }

        try {
            // create userResource from request data
            let userResource: UserResourceModel = req.body;
            userResource.updatedAt = new Date();

            const updatedUserResource = await UserResourceModel.update(userResource,
                {
                    where: {
                        id: {
                            [Op.eq]: userResourceId
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });

            // check if userResource are updated
            if (updatedUserResource[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
                //res.status(200).send(updatedUserResource);

            } else {
                res.status(404).send(UserResourceErrors.USER_RESOURCE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update user resource - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    delete = async (req: Request, res: Response, next: any) => {
        // get userResourceID from request
        const userResourceId = req.params.id;

        // check if resourceId are set
        // if not are set, break execution
        if (!userResourceId) {
            res.status(400).send(UserResourceErrors.USER_RESOURCE_ID_EMPTY_ERROR);
            return;
        }

        try {
            const userResource = await UserResourceModel.update({deletedAt: new Date()},
                {
                    where: {
                        id: {
                            [Op.eq]: userResourceId
                        },
                        deletedAt: {
                            [Op.eq]: null
                        }
                    }
                });

            // check if userResource are deleted
            if (userResource[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(404).send(UserResourceErrors.USER_RESOURCE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete user resource - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };
    validateInsert = (data: any, res: Response): boolean => {
        return true;
    };

    respondInsertRequest = (result: any, res: Response) => {

    };

    respondDeleteRequest = async (result: any, modelId: number, res: Response) => {

    };

    respondUpdateRequest = async (result: any, modelId: number, res: Response) => {

    };

    getAllByUserId = async (req: Request, res: Response, next: any) => {
        const userId = req.params.user_id;
        // check if centerID are set
        // if not are set, break execution
        if (!userId) {
            res.status(400).send(UserResourceErrors.USER_ID_EMPTY_ERROR);
            return false;
        }

        try {
            const data = await UserResourceModel.findAll({
                where: {
                    user_id: userId
                }
            });
            res.status(200).send(data);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all user resource - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };
}
const usersResourcesController = new UsersResourcesController();
export default usersResourcesController;
