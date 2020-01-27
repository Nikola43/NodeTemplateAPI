import { Router } from "express";
import CoordinatesController from "../controllers/CoordinatesController";

export class CoordinatesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL COORDINATES */
        this.router.get("/", CoordinatesController.getAll);

        /* GET COORDINATE BY ID */
        this.router.get("/:id", CoordinatesController.getById);

        /* INSERT COORDINATE */
        this.router.post("/", CoordinatesController.insert);

        /* UPDATE COORDINATE BY ID*/
        this.router.patch("/:id", CoordinatesController.update);

        /* DELETE COORDINATE BY ID*/
        this.router.delete("/:id", CoordinatesController.delete);
    }
}

let coordinatesRoutes = new CoordinatesRoutes();
coordinatesRoutes.init();
export default coordinatesRoutes.router;
