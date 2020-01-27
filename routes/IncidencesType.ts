import { Router } from "express";
import IncidencesTypesController from "../controllers/IncidencesTypesController";

export class IncidencesTypesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL DOCUMENTSTYPES */
        this.router.get("/", IncidencesTypesController.getAll);

        /* GET DOCUMENTTYPE BY ID */
        this.router.get("/:id", IncidencesTypesController.getById);

        /* INSERT DOCUMENTTYPE */
        this.router.post("/", IncidencesTypesController.insert);

        /* UPDATE DOCUMENTTYPE BY ID*/
        this.router.patch("/:id", IncidencesTypesController.update);

        /* DELETE DOCUMENTTYPE BY ID*/
        this.router.delete("/:id", IncidencesTypesController.delete);
    }
}

let incidencesTypesRoutes = new IncidencesTypesRoutes();
incidencesTypesRoutes.init();
export default incidencesTypesRoutes.router;
