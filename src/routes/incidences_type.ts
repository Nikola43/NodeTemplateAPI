import { Router } from "express";
import IncidencesTypesController from "../controllers/incidence_type_controller";

export class IncidencesTypesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL DOCUMENTSTYPES */
        this.router.get("/", IncidencesTypesController.getAll);

        /* GET DOCUMENTTYPE BY ID */
        this.router.get("/:id", IncidencesTypesController.getDocumentTypeById);

        /* INSERT DOCUMENTTYPE */
        this.router.post("/", IncidencesTypesController.insertDocumentType);

        /* UPDATE DOCUMENTTYPE BY ID*/
        this.router.patch("/:id", IncidencesTypesController.updateDocumentType);

        /* DELETE DOCUMENTTYPE BY ID*/
        this.router.delete("/:id", IncidencesTypesController.deleteDocumentType);
    }
}

let incidencesTypesRoutes = new IncidencesTypesRoutes();
incidencesTypesRoutes.init();
export default incidencesTypesRoutes.router;
