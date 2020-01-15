import { Router } from "express";
import DocumentsController from "../controllers/document_controller";

export class DocumentsRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL DOCUMENTS */
        this.router.get("/", DocumentsController.getAll);

        /* GET DOCUMENT BY ID */
        this.router.get("/:id", DocumentsController.getDocumentById);

        /* INSERT DOCUMENT */
        this.router.post("/", DocumentsController.insertDocument);

        /* UPDATE DOCUMENT BY ID*/
        this.router.patch("/:id", DocumentsController.updateDocument);

        /* DELETE DOCUMENT BY ID*/
        this.router.delete("/:id", DocumentsController.deleteDocument);
    }
}

let documentsRoutes = new DocumentsRoutes();
documentsRoutes.init();
export default documentsRoutes.router;
