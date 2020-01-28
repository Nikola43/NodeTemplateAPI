import {Router} from "express";
import ResourcesTypeController from "../controllers/typesControllers/ResourcesTypesController";
import {checkJwt} from "../middlewares/CheckJwt";


export class ResourcesTypeRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL RESOURCES */
        this.router.get("/", [checkJwt], ResourcesTypeController.getAll);

        /* GET RESOURCE BY ID */
        this.router.get("/:id", [checkJwt], ResourcesTypeController.getById);

        /* INSERT RESOURCE */
        this.router.post("/", [checkJwt], ResourcesTypeController.insert);

        /* UPDATE RESOURCE BY ID*/
        this.router.patch("/:id", [checkJwt], ResourcesTypeController.update);

        /* DELETE RESOURCE BY ID*/
        this.router.delete("/:id", [checkJwt], ResourcesTypeController.delete);
    }
}

let resourcesTypesRoutes = new ResourcesTypeRoutes();
resourcesTypesRoutes.init();
export default resourcesTypesRoutes.router;
