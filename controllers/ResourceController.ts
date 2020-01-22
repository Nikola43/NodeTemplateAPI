import {Request, Response} from "express";
import ResourceErrors from "../errors/ResourceErrors";
import {ResourceModel} from "../db/models/ResourceModel";
import ServerErrors from "../errors/ServerErrors";
import Messages from "../messages/Messages";



const Sequelize = require('sequelize');
const Op = Sequelize.Op;

export default class ResourceController {
    static getAll = async (req: Request, res: Response, next: any) => {
        try {
            const resources = await ResourceModel.findAll();
            res.status(200).send(resources);
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    static getResourceById = async (req: Request, res: Response, next: any) => {
        try {
            const resource = await ResourceModel.findByPk(req.params.id);
            console.log(req.params.id);

            if (resource) {
                res.status(200).send(resource);
            } else {
                res.status(404).send(ResourceErrors.RESOURCE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send({error: "internal error"});
        }
    };

    static insertResource = async (req: Request, res: Response, next: any) => {

        // get resource data from request
        const centerId = req.body.center_id;
        const typeId = req.body.type_id;
        const name = req.body.name;

        // check if centerID are set
        // if not are set, break execution
        if (!centerId) {
            // todo cambiar tipo de error
            res.status(400).send(ResourceErrors.RESOURCE_ALREADY_HAS_ASIGNED_CENTER_ERROR);
            return;
        }

        if (!typeId) {
            res.status(400).send(ResourceErrors.TYPE_ID_EMPTY_ERROR);
            return;
        }

        if (!name) {
            res.status(400).send(ResourceErrors.NAME_EMPTY_ERROR);
            return;
        }

        // find resource in db for check if already exists
        try {
            const tempResource = await ResourceModel.findOne({
                attributes: [
                    'name',
                ], where: {
                    name: {
                        [Op.eq]: name
                    },
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });

            // check if resource already have center
            // break execution
            if (tempResource) {
                res.status(400).send(ResourceErrors.RESOURCE_ALREADY_EXIST_ERROR);
                return;
            } else {

                const newResourceData: ResourceModel = req.body;
                newResourceData.status=1;

                try {
                    // Create resource from request data
                    const newResource = await ResourceModel.create(newResourceData);

                    res.status(200).send(newResource);
                } catch (e) {
                    console.log(e);
                    res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    static updateResource = async (req: Request, res: Response, next: any) => {
        // get resourceID from request
        const resourceId = req.params.id;

        // check if resourceId are set
        // if not are set, break execution
        if (!resourceId) {
            res.status(400).send(ResourceErrors.RESOURCE_ID_EMPTY_ERROR);
            return;
        }

        try {
            // create resource from request data
            let resource: ResourceModel = req.body;
            resource.updatedAt = new Date();

            const updatedResource = await ResourceModel.update(resource,
                {
                    where: {
                        id: {
                            [Op.eq]: resourceId
                        },
                        deletedAt: {
                            [Op.is]: null
                        }
                    }
                });

            // check if resource are updated
            if (updatedResource[0] === 1) {
               res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
               //res.status(200).send(updatedResource);

            } else {
                res.status(404).send(ResourceErrors.RESOURCE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };

    static deleteResource = async (req: Request, res: Response, next: any) => {
        // get resourceID from request
        const resourceId = req.params.id;

        // check if resourceId are set
        // if not are set, break execution
        if (!resourceId) {
            res.status(400).send(ResourceErrors.RESOURCE_ID_EMPTY_ERROR);
            return;
        }

        try {
            const resource = await ResourceModel.update({deletedAt: new Date()},
                {
                    where: {
                        id: {
                            [Op.eq]: resourceId
                        },
                        deletedAt: {
                            [Op.eq]: null
                        }
                    }
                });

            // check if resource are deleted
            if (resource[0] === 1) {
                res.status(200).send(Messages.SUCCESS_REQUEST_MESSAGE);
            } else {
                res.status(404).send(ResourceErrors.RESOURCE_NOT_FOUND_ERROR);
            }
        } catch (e) {
            console.log(e);
            res.status(500).send(ServerErrors.INTERNAL_SERVER_ERROR);
        }
    };
}
