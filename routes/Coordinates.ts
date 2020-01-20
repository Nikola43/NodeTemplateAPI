import { Router } from "express";
import CoordinatesController from "../controllers/CoordinateController";

export class CoordinatesRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET ALL COORDINATES */
        this.router.get("/", CoordinatesController.getAll);

        /* GET COORDINATE BY ID */
        this.router.get("/:id", CoordinatesController.getCoordinateById);

        /* INSERT COORDINATE */
        this.router.post("/", CoordinatesController.insertCoordinate);

        /* UPDATE COORDINATE BY ID*/
        this.router.patch("/:id", CoordinatesController.updateCoordinate);

        /* DELETE COORDINATE BY ID*/
        this.router.delete("/:id", CoordinatesController.deleteCoordinate);
    }
}

let coordinatesRoutes = new CoordinatesRoutes();
coordinatesRoutes.init();
export default coordinatesRoutes.router;
