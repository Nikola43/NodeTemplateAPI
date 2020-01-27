import {Router} from "express";
import LocationController from "../controllers/LocationsController";
import {checkJwt} from "../middlewares/CheckJwt";

export class LocationsRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL LOCATIONS */
        this.router.get("/", [checkJwt], LocationController.getAll);

        /* GET LOCATION BY ID */
        this.router.get("/:id", [checkJwt], LocationController.getById);

        /* INSERT LOCATION */
        this.router.post("/", [checkJwt], LocationController.insert);

        /* UPDATE LOCATION BY ID*/
        this.router.patch("/:id", [checkJwt], LocationController.update);

        /* DELETE LOCATION BY ID*/
        this.router.delete("/:id", [checkJwt], LocationController.delete);
    }
}

let locationsRoutes = new LocationsRoutes();
locationsRoutes.init();
export default locationsRoutes.router;
