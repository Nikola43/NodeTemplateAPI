import {Router} from "express";
import UsersController from "../controllers/UsersController";
import {checkJwt} from "../middlewares/CheckJwt";

export class UsersRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL USERS */
        this.router.get("/", [checkJwt], UsersController.getAll);

        /* GET USER BY ID */
        this.router.get("/:id", UsersController.getById);

        /* INSERT USER */
        this.router.post("/", UsersController.insert);

        /* UPDATE USER BY ID*/
        this.router.patch("/:id", UsersController.update);

        /* DELETE USER BY ID*/
        this.router.delete("/:id", UsersController.delete);
    }
}

let usersRoutes = new UsersRoutes();
usersRoutes.init();
export default usersRoutes.router;
