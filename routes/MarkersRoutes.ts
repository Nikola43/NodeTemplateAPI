import {Router} from "express";
import MarkersController from "../controllers/MarkersController";

export class MarkersRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL MARKERS */
        this.router.get("/",  MarkersController.getAll);
    }
}

let markserRoutes = new MarkersRoutes();
markserRoutes.init();
export default markserRoutes.router;
