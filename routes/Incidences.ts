import { Router } from "express";
import IncidenceController from "../controllers/IncidenceController";

export class IncidenceRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL DOCUMENTSTYPES */
        this.router.get("/", IncidenceController.getAll);

        /* GET DOCUMENTTYPE BY ID */
        this.router.get("/:id", IncidenceController.getIncidenceById);

        /* INSERT DOCUMENTTYPE */
        this.router.post("/", IncidenceController.insertIncidence);

        /* UPDATE DOCUMENTTYPE BY ID*/
        this.router.patch("/:id", IncidenceController.updateIncidence);

        /* DELETE DOCUMENTTYPE BY ID*/
        this.router.delete("/:id", IncidenceController.deleteIncidence);
    }
}

let incidencesTypesRoutes = new IncidenceRoutes();
incidencesTypesRoutes.init();
export default incidencesTypesRoutes.router;
