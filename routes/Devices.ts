import {Router} from "express";
import DeviceController from "../controllers/DevicesController";
import {checkJwt} from "../middlewares/CheckJwt";

export class DeviceRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL DEVICES */
        this.router.get("/", [checkJwt], DeviceController.getAll);

        /* GET DEVICE BY ID */
        this.router.get("/:id", [checkJwt], DeviceController.getById);

        /* INSERT DEVICE*/
        this.router.post("/", [checkJwt], DeviceController.insert);

        /* UPDATE DEVICE BY ID*/
        this.router.patch("/:id", [checkJwt], DeviceController.update);

        /* DELETE DEVICE BY ID*/
        this.router.delete("/:id", [checkJwt], DeviceController.delete);
    }
}

let deviceRoutes = new DeviceRoutes();
deviceRoutes.init();
export default deviceRoutes.router;
