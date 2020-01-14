import { Router } from "express";
import DevicesTypesController from "../controllers/device_type_controller";

export class DevicesTypesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL COORDINATES */
        this.router.get("/", DevicesTypesController.getAll);

        /* GET COORDINATE BY ID */
        this.router.get("/:id", DevicesTypesController.getDeviceTypeById);

        /* INSERT COORDINATE */
        this.router.post("/", DevicesTypesController.insertDeviceType);

        /* UPDATE COORDINATE BY ID*/
        this.router.patch("/:id", DevicesTypesController.updateDeviceType);

        /* DELETE COORDINATE BY ID*/
        this.router.delete("/:id", DevicesTypesController.deleteDeviceType);
    }
}

let devicesTypesRoutes = new DevicesTypesRoutes();
devicesTypesRoutes.init();
export default devicesTypesRoutes.router;
