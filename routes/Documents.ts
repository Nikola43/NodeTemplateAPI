import { Router } from "express";
import DocumentsController from "../controllers/DocumentsController";

export class DocumentsRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL DOCUMENTS */
        this.router.get("/", DocumentsController.getAll);

        /* GET DOCUMENT BY ID */
        this.router.get("/:id", DocumentsController.getById);

        /* INSERT DOCUMENT */
        this.router.post("/", DocumentsController.insert);

        /* UPDATE DOCUMENT BY ID*/
        this.router.patch("/:id", DocumentsController.update);

        /* DELETE DOCUMENT BY ID*/
        this.router.delete("/:id", DocumentsController.delete
        );
    }
}

let documentsRoutes = new DocumentsRoutes();
documentsRoutes.init();
export default documentsRoutes.router;
