import {Router} from "express";
import PanicButtonController from "../controllers/PanicButtonController";
import {checkJwt} from "../middlewares/CheckJwt";

export class PanicButtonsRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL PANICBUTTONS */
        this.router.get("/", [checkJwt], PanicButtonController.getAll);

        /* GET PANICBUTTON BY ID */
        this.router.get("/:id", [checkJwt], PanicButtonController.getPanicButtonById);

        /* INSERT PANICBUTTON */
        this.router.post("/", [checkJwt], PanicButtonController.insertPanicButton);

        /* UPDATE PANICBUTTON BY ID*/
        this.router.patch("/:id", [checkJwt], PanicButtonController.updatePanicButton);

        /* DELETE PANICBUTTON BY ID*/
        this.router.delete("/:id", [checkJwt], PanicButtonController.deletePanicButton);
    }
}

let panicButtonsRoutes = new PanicButtonsRoutes();
panicButtonsRoutes.init();
export default panicButtonsRoutes.router;
