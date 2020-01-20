import {Router} from "express";
import ResourcesController from "../controllers/ResourceController";
import {checkJwt} from "../../middlewares/CheckJwt";


export class ResourcesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL RESOURCES */
        this.router.get("/", [checkJwt], ResourcesController.getAll);

        /* GET RESOURCE BY ID */
        this.router.get("/:id", [checkJwt], ResourcesController.getResourceById);

        /* INSERT RESOURCE */
        this.router.post("/", [checkJwt], ResourcesController.insertResource);

        /* UPDATE RESOURCE BY ID*/
        this.router.patch("/:id", [checkJwt], ResourcesController.updateResource);

        /* DELETE RESOURCE BY ID*/
        this.router.delete("/:id", [checkJwt], ResourcesController.deleteResource);
    }
}

let resourcesRoutes = new ResourcesRoutes();
resourcesRoutes.init();
export default resourcesRoutes.router;
