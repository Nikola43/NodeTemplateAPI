import {Router} from "express";
import UsersController from "../controllers/user_controller";
import {checkJwt} from "../../middlewares/checkJwt";

export class UsersRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL USERS */
        this.router.get("/", [checkJwt], UsersController.getAll);

        /* GET USER BY ID */
        this.router.get("/:id", UsersController.getUserById);

        /* INSERT USER */
        this.router.post("/", UsersController.insertUser);

        /* UPDATE USER BY ID*/
        this.router.patch("/:id", UsersController.updateUser);

        /* DELETE USER BY ID*/
        this.router.delete("/:id", UsersController.deleteUser);
    }
}

let usersRoutes = new UsersRoutes();
usersRoutes.init();
export default usersRoutes.router;
