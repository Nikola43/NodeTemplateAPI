import { Router } from "express";
import CentersTypesController from "../controllers/CenterTypeController";

export class CentersTypesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL CENTER_TYPES_TYPE */
        this.router.get("/", CentersTypesController.getAll);

        /* GET CENTER_TYPE BY ID */
        this.router.get("/:id", CentersTypesController.getCenterTypeById);

        /* INSERT CENTER_TYPE */
        this.router.post("/", CentersTypesController.insertCenterType);

        /* UPDATE CENTER_TYPE BY ID*/
        this.router.patch("/:id", CentersTypesController.updateCenterType);

        /* DELETE CENTER_TYPE BY ID*/
        this.router.delete("/:id", CentersTypesController.deleteCenterType);
    }
}

let centersTypesRoutes = new CentersTypesRoutes();
centersTypesRoutes.init();
export default centersTypesRoutes.router;
