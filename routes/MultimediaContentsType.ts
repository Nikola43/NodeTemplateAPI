import {Router} from "express";
import MultimediaContentsTypesController from "../controllers/typesControllers/MultimediaContentsTypesController";
import {checkJwt} from "../middlewares/CheckJwt";

export class MultimediaContentsRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL MULTIMEDIACONTENTS TYPES */
        this.router.get("/", [checkJwt], MultimediaContentsTypesController.getAll);

        /* GET MULTIMEDIACONTENTS BY ID */
        this.router.get("/:id", [checkJwt], MultimediaContentsTypesController.getById);

        /* INSERT MULTIMEDIACONTENTS */
        this.router.post("/", [checkJwt], MultimediaContentsTypesController.insert);

        /* UPDATE MULTIMEDIACONTENTS BY ID*/
        this.router.patch("/:id", [checkJwt], MultimediaContentsTypesController.update);

        /* DELETE MULTIMEDIACONTENTS BY ID*/
        this.router.delete("/:id", [checkJwt], MultimediaContentsTypesController.delete);
    }
}

let multimediaContentsRoutes = new MultimediaContentsRoutes();
multimediaContentsRoutes.init();
export default multimediaContentsRoutes.router;
