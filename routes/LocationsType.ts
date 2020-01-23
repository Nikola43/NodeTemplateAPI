import {Router} from "express";
import LocationTypeController from "../controllers/LocationTypeController";
import {checkJwt} from "../middlewares/CheckJwt";

export class LocationsTypeRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL LOCATIONTYPES */
        this.router.get("/", [checkJwt], LocationTypeController.getAll);

        /* GET LOCATIONTYPE BY ID */
        this.router.get("/:id", [checkJwt], LocationTypeController.getLocationTypeById);

        /* INSERT LOCATIONTYPE */
        this.router.post("/", [checkJwt], LocationTypeController.insertLocationType);

        /* UPDATE LOCATIONTYPE BY ID*/
        this.router.patch("/:id", [checkJwt], LocationTypeController.updateLocationType);

        /* DELETE LOCATIONTYPE BY ID*/
        this.router.delete("/:id", [checkJwt], LocationTypeController.deleteLocationType);
    }
}

let locationsTypeRoutes = new LocationsTypeRoutes();
locationsTypeRoutes.init();
export default locationsTypeRoutes.router;
