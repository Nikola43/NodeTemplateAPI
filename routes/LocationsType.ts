import {Router} from "express";
import LocationTypeController from "../controllers/typesControllers/LocationsTypesController";
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
        this.router.get("/:id", [checkJwt], LocationTypeController.getById);

        /* INSERT LOCATIONTYPE */
        this.router.post("/", [checkJwt], LocationTypeController.insert);

        /* UPDATE LOCATIONTYPE BY ID*/
        this.router.patch("/:id", [checkJwt], LocationTypeController.update);

        /* DELETE LOCATIONTYPE BY ID*/
        this.router.delete("/:id", [checkJwt], LocationTypeController.delete);
    }
}

let locationsTypeRoutes = new LocationsTypeRoutes();
locationsTypeRoutes.init();
export default locationsTypeRoutes.router;
