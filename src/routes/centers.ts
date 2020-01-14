import { Router } from "express";
import CentersController from "../controllers/center_controller";

export class CentersRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL CENTERS */
        this.router.get("/", CentersController.getAll);

        /* GET CENTER BY ID */
        this.router.get("/:id", CentersController.getCenterById);

        /* INSERT CENTER */
        this.router.post("/", CentersController.insertCenter);

        /* UPDATE CENTER BY ID*/
        this.router.patch("/:id", CentersController.updateCenter);

        /* DELETE CENTER BY ID*/
        this.router.delete("/:id", CentersController.deleteCenter);
    }
}

let centersRoutes = new CentersRoutes();
centersRoutes.init();
export default centersRoutes.router;
