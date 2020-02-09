import {Request, Response, Router} from "express";
import AuthController from "../auth/AuthController";
import {checkJwt} from "../middlewares/CheckJwt";
import UserController from "../controllers/UsersController";

export class IndexRoutes {
    router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        /* GET home page. */
        this.router.get('', function (req: Request, res: Response, next: any) {
            res.render('index', {title: 'Express'});
        });

        /* GET home page. */
        this.router.get('/recovery', function (req: Request, res: Response, next: any) {
            const passwordRecoveryToken = req.query.token;
            console.log(passwordRecoveryToken);
            res.render('PasswordRecovery', {title: 'Express'});
        });

        /* AUTH */
        this.router.post('/login', AuthController.login);
        this.router.post('/signup', UserController.insert);
        this.router.post('/change-password', [checkJwt], AuthController.changePassword);
    }
}

let indexRoutes = new IndexRoutes();
indexRoutes.init();
export default indexRoutes.router;
