import {Request, Response, Router} from "express";

export class IndexRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET home page. */
        this.router.get('/', function (req: Request, res: Response, next: any) {
            res.render('index', {title: 'Express'});
        });
    }
}

let indexRoutes = new IndexRoutes();
indexRoutes.init();
export default indexRoutes.router;
