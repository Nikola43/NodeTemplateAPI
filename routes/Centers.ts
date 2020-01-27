import {Router} from "express";
import CentersController from "../controllers/CentersController";
import {checkJwt} from "../middlewares/CheckJwt";

export class CentersRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL CENTERS */
        this.router.get("/", [checkJwt], CentersController.getAll);

        /* GET CENTER BY ID */
        this.router.get("/:id", [checkJwt], CentersController.getById);

        /* INSERT CENTER */
        this.router.post("/", [checkJwt], CentersController.insert);

        /* UPDATE CENTER BY ID*/
        this.router.patch("/:id", [checkJwt], CentersController.update);

        /* DELETE CENTER BY ID*/
        this.router.delete("/:id", [checkJwt], CentersController.delete);
    }
}

let centersRoutes = new CentersRoutes();
centersRoutes.init();
export default centersRoutes.router;
