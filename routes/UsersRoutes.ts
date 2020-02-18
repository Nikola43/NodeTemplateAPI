import {Router} from "express";
import UsersController from "../controllers/UsersController";
import MultimediaContentController from "../controllers/MultimediaContentsController";
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
        this.router.get("/:id", [checkJwt], UsersController.getById);

        /* INSERT USER */
        this.router.post("/", [checkJwt], UsersController.insert);

        /* UPDATE USER BY ID*/
        this.router.patch("/:id", [checkJwt], UsersController.update);

        /* DELETE USER BY ID*/
        this.router.delete("/:id", [checkJwt], UsersController.delete);

        /* RECOVERY USER PASSWORD*/
        this.router.post("/recovery", [checkJwt], UsersController.recoveryPassword);

        /* GET USER LAST POSITION*/
        this.router.get("/:id/last", [checkJwt], UsersController.getLastPosition);

        /* UPDATE USER POSITION */
        this.router.post("/:id/position", [checkJwt], UsersController.newPosition);

        /* GET ALL MULTIMEDIA OF THIS USER */
        this.router.get("/:id/multimedia", [checkJwt], MultimediaContentController.getAllbyUserID);

    }
}

let usersRoutes = new UsersRoutes();
usersRoutes.init();
export default usersRoutes.router;
