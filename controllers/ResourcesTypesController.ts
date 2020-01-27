import {Request, Response} from "express";
import ResourceErrors from "../errors/ResourceTypeErrors";
import {ResourceTypeModel} from "../db/models/ResourceTypeModel";
import ServerErrors from "../errors/ServerErrors";
import Messages from "../messages/Messages";
import {LOGUtil} from "../utils/LOGUtil";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class ResourcesController {
    getAll = async (req: Request, res: Response, next: any) => {
        try {
            const resourcesType = await ResourceTypeModel.findAll();
            res.status(200).send(resourcesType);
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get all resource type - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    getById = async (req: Request, res: Response, next: any) => {
        try {
            const resourceType = await ResourceTypeModel.findByPk(req.params.id);
            console.log(req.params.id);

            if (resourceType) {
                res.status(200).send(resourceType);
            } else {
                res.status(404).send(ResourceErrors.RESOURCE_TYPE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("get resource type by ID - " + e.toString());
            res.status(500).send({error: "internal error"});
        }
    };

    insert = async (req: Request, res: Response, next: any) => {

        const type = req.body.type;

        // check if centerID are set
        // if not are set, break execution
        if (!type) {
            res.status(400).send(ResourceErrors.RESOURCE_TYPE_NOT_FOUND_ERROR);
            return;
        }

        // find resourceType in db for check if already exists
        try {
            const tempResource = await ResourceTypeModel.findOne({
                attributes: [
                    'type',
                ], where: {
                    type: {
                        [Op.eq]: type
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // check if resourceType already have center
            // break execution
            if (tempResource) {
                res.status(400).send(ResourceErrors.RESOURCE_TYPE_ALREADY_EXIST_ERROR);
                return;
            } else {

                const newResourceTypeData: ResourceTypeModel = req.body;

                try {
                    // Create resourceType from request data
                    const newResourceType = await ResourceTypeModel.create(newResourceTypeData);

                    res.status(200).send(newResourceType);
                } catch (e) {
                    console.log(e);
                    LOGUtil.saveLog("insert resource type - " + e.toString());
                    res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("insert resource type - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    update = async (req: Request, res: Response, next: any) => {
        // get resourceID from request
        const resourceTypeId = req.params.id;

        // check if resourceId are set
        // if not are set, break execution
        if (!resourceTypeId) {
            res.status(400).send(ResourceErrors.RESOURCE_TYPE_ID_EMPTY_ERROR);
            return;
        }

        try {
            // create resourceType from request data
            let resourceType: ResourceTypeModel = req.body;
            resourceType.updatedAt = new Date();

            const updatedResourceType = await ResourceTypeModel.update(resourceType,
                {
                    where: {
                        id: {
                            [Op.eq]: resourceTypeId
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });

            // check if resourceType are updated
            if (updatedResourceType[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
                //res.status(200).send(updatedResource);

            } else {
                res.status(404).send(ResourceErrors.RESOURCE_TYPE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("update resource type - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    delete = async (req: Request, res: Response, next: any) => {
        // get resourceID from request
        const resourceTypeId = req.params.id;

        // check if resourceId are set
        // if not are set, break execution
        if (!resourceTypeId) {
            res.status(400).send(ResourceErrors.RESOURCE_TYPE_ID_EMPTY_ERROR);
            return;
        }

        try {
            const resourceType = await ResourceTypeModel.update({deletedAt: new Date()},
                {
                    where: {
                        id: {
                            [Op.eq]: resourceTypeId
                        },
                        deletedAt: {
                            [Op.eq]: null
                        }
                    }
                });

            // check if resourceType are deleted
            if (resourceType[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(404).send(ResourceErrors.USED_RESOURCE_TYPE_ERROR);
            }
        } catch (e) {
            console.log(e);
            LOGUtil.saveLog("delete resource type - " + e.toString());
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };
}

const resourcesController = new ResourcesController();
export default resourcesController;
