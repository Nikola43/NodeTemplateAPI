import { Router } from "express";
import DocumentsTypesController from "../controllers/DocumentTypeController";

export class DocumentsTypesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL DOCUMENTSTYPES */
        this.router.get("/", DocumentsTypesController.getAll);

        /* GET DOCUMENTTYPE BY ID */
        this.router.get("/:id", DocumentsTypesController.getDocumentTypeById);

        /* INSERT DOCUMENTTYPE */
        this.router.post("/", DocumentsTypesController.insertDocumentType);

        /* UPDATE DOCUMENTTYPE BY ID*/
        this.router.patch("/:id", DocumentsTypesController.updateDocumentType);

        /* DELETE DOCUMENTTYPE BY ID*/
        this.router.delete("/:id", DocumentsTypesController.deleteDocumentType);
    }
}

let documentsTypesRoutes = new DocumentsTypesRoutes();
documentsTypesRoutes.init();
export default documentsTypesRoutes.router;
