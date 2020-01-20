import { Router } from "express";
import IncidencesTypesController from "../controllers/IncidenceTypeController";

export class IncidencesTypesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL DOCUMENTSTYPES */
        this.router.get("/", IncidencesTypesController.getAll);

        /* GET DOCUMENTTYPE BY ID */
        this.router.get("/:id", IncidencesTypesController.getIncidenceTypeById);

        /* INSERT DOCUMENTTYPE */
        this.router.post("/", IncidencesTypesController.insertIncidenceType);

        /* UPDATE DOCUMENTTYPE BY ID*/
        this.router.patch("/:id", IncidencesTypesController.updateIncidenceType);

        /* DELETE DOCUMENTTYPE BY ID*/
        this.router.delete("/:id", IncidencesTypesController.deleteIncidenceType);
    }
}

let incidencesTypesRoutes = new IncidencesTypesRoutes();
incidencesTypesRoutes.init();
export default incidencesTypesRoutes.router;
