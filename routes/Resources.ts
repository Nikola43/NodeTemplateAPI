import {Router} from "express";
import ResourcesController from "../controllers/ResourcesController";
import {checkJwt} from "../middlewares/CheckJwt";


export class ResourcesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL RESOURCES */
        this.router.get("/", [checkJwt], ResourcesController.getAll);

        /* GET RESOURCE BY ID */
        this.router.get("/:id", [checkJwt], ResourcesController.getById);

        /* INSERT RESOURCE */
        this.router.post("/", [checkJwt], ResourcesController.insert);

        /* UPDATE RESOURCE BY ID*/
        this.router.patch("/:id", [checkJwt], ResourcesController.update);

        /* DELETE RESOURCE BY ID*/
        this.router.delete("/:id", [checkJwt], ResourcesController.delete);
    }
}

let resourcesRoutes = new ResourcesRoutes();
resourcesRoutes.init();
export default resourcesRoutes.router;
