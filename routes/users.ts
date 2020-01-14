import {Request, Response, Router} from "express";
import usersController from "../controllers/user_controller";


export class UsersRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL USERS */
        this.router.get("/", usersController.getAll);

        /* GET USER BY ID */
        this.router.get("/:id", usersController.getAll);

        /* INSERT USER */
        this.router.post("/", usersController.getAll);

        /* UPDATE USER BY ID*/
        this.router.patch("/:id", usersController.getAll);

        /* DELETE USER BY ID*/
        this.router.delete("/:id", usersController.getAll);

        this.router.get('/test', function (req: Request, res: Response, next: any) {
            res.status(200).send("Hello");
        });
    }
}

let usersRoutes = new UsersRoutes();
usersRoutes.init();
export default usersRoutes.router;
