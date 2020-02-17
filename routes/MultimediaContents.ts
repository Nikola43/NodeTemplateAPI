import {Router} from "express";
import MultimediaContentsController from "../controllers/MultimediaContentsController";
import {checkJwt} from "../middlewares/CheckJwt";

export class MultimediaContentsRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL PANICBUTTONS */
        this.router.get("/", [checkJwt], MultimediaContentsController.getAll);

        /* GET PANICBUTTON BY ID */
        this.router.get("/:id", [checkJwt], MultimediaContentsController.getById);

        /* INSERT PANICBUTTON */
        this.router.post("/", [checkJwt], MultimediaContentsController.insert);

        /* UPDATE PANICBUTTON BY ID*/
        this.router.patch("/:id", [checkJwt], MultimediaContentsController.update);

        /* DELETE PANICBUTTON BY ID*/
        this.router.delete("/:id", [checkJwt], MultimediaContentsController.delete);

        /* UPLOAD FILE */
        this.router.post("/upload", [checkJwt], MultimediaContentsController.upload);
    }
}

let multimediaContentsRoutes = new MultimediaContentsRoutes();
multimediaContentsRoutes.init();
export default multimediaContentsRoutes.router;
