import {Router} from "express";
import PanicButtonsController from "../controllers/PanicButtonsController";
import {checkJwt} from "../middlewares/CheckJwt";

export class PanicButtonsRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL PANICBUTTONS */
        this.router.get("/", [checkJwt], PanicButtonsController.getAll);

        /* GET PANICBUTTON BY ID */
        this.router.get("/:id", [checkJwt], PanicButtonsController.getById);

        /* INSERT PANICBUTTON */
        this.router.post("/", [checkJwt], PanicButtonsController.insert);

        /* UPDATE PANICBUTTON BY ID*/
        this.router.patch("/:id", [checkJwt], PanicButtonsController.update);

        /* DELETE PANICBUTTON BY ID*/
        this.router.delete("/:id", [checkJwt], PanicButtonsController.delete);
    }
}

let panicButtonsRoutes = new PanicButtonsRoutes();
panicButtonsRoutes.init();
export default panicButtonsRoutes.router;
