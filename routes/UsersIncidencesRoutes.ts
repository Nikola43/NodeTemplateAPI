import {Router} from "express";
import usersIncidencesController from "../controllers/UsersIncidencesController";
import {checkJwt} from "../middlewares/CheckJwt";

export class UsersIncidencesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL USERS */
        this.router.get("/", [checkJwt], usersIncidencesController.getAll);

        /* GET USER BY ID */
        this.router.get("/:user_id/:incidence_id", [checkJwt],usersIncidencesController.getById);

        /* INSERT USER */
        this.router.post("/", [checkJwt],usersIncidencesController.insert);

        /* DELETE USER BY ID*/
        this.router.delete("/:id",[checkJwt], usersIncidencesController.delete);

        /* DELETE USER BY ID*/
        this.router.get("/:user_id",[checkJwt], usersIncidencesController.getAllByUserId);
    }
}

let usersIncidencesRoutes = new UsersIncidencesRoutes();
usersIncidencesRoutes.init();
export default usersIncidencesRoutes.router;
