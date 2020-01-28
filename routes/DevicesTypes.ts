import { Router } from "express";
import DevicesTypesController from "../controllers/typesControllers/DevicesTypesController";

export class DevicesTypesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL COORDINATES */
        this.router.get("/", DevicesTypesController.getAll);

        /* GET COORDINATE BY ID */
        this.router.get("/:id", DevicesTypesController.getById);

        /* INSERT COORDINATE */
        this.router.post("/", DevicesTypesController.insert);

        /* UPDATE COORDINATE BY ID*/
        this.router.patch("/:id", DevicesTypesController.update);

        /* DELETE COORDINATE BY ID*/
        this.router.delete("/:id", DevicesTypesController.delete);
    }
}

let devicesTypesRoutes = new DevicesTypesRoutes();
devicesTypesRoutes.init();
export default devicesTypesRoutes.router;
