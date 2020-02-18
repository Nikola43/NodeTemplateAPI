import {Router} from "express";
import usersResourcesController from "../controllers/UsersResourcesController";
import {checkJwt} from "../middlewares/CheckJwt";

export class UsersResourcesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL USERS */
        this.router.get("/", [checkJwt], usersResourcesController.getAll);

        /* GET USER BY ID */
        this.router.get("/user/:user_id/resource/:resource_id", [checkJwt],usersResourcesController.getById);

        /* INSERT USER */
        this.router.post("/", [checkJwt],usersResourcesController.insert);

        /* DELETE USER BY ID*/
        this.router.delete("/:id",[checkJwt], usersResourcesController.delete);

        /* GET ALL BY USER BY ID*/
        this.router.get("/user/:user_id",[checkJwt], usersResourcesController.getAllByUserId);
    }
}

let usersResourcesRoutes = new UsersResourcesRoutes();
usersResourcesRoutes.init();
export default usersResourcesRoutes.router;
