import { Router } from "express";
import DocumentsTypesController from "../controllers/DocumentTypesController";

export class DocumentsTypesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL DOCUMENTSTYPES */
        this.router.get("/", DocumentsTypesController.getAll);

        /* GET DOCUMENTTYPE BY ID */
        this.router.get("/:id", DocumentsTypesController.getById);

        /* INSERT DOCUMENTTYPE */
        this.router.post("/", DocumentsTypesController.insert);

        /* UPDATE DOCUMENTTYPE BY ID*/
        this.router.patch("/:id", DocumentsTypesController.update);

        /* DELETE DOCUMENTTYPE BY ID*/
        this.router.delete("/:id", DocumentsTypesController.delete);
    }
}

let documentsTypesRoutes = new DocumentsTypesRoutes();
documentsTypesRoutes.init();
export default documentsTypesRoutes.router;
