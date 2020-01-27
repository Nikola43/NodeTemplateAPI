import { Router } from "express";
import CentersController from "../controllers/CentersController";

export class CentersRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL CENTERS */
        this.router.get("/", CentersController.getAll);

        /* GET CENTER BY ID */
        this.router.get("/:id", CentersController.getById);

        /* INSERT CENTER */
        this.router.post("/", CentersController.insert);

        /* UPDATE CENTER BY ID*/
        this.router.patch("/:id", CentersController.update);

        /* DELETE CENTER BY ID*/
        this.router.delete("/:id", CentersController.delete);
    }
}

let centersRoutes = new CentersRoutes();
centersRoutes.init();
export default centersRoutes.router;
