"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const users_1 = __importDefault(require("./routes/users"));
const express_1 = __importDefault(require("express"));
const connect_1 = __importDefault(require("./connect"));
const config_1 = require("./config/config");
class App {
    constructor() {
        this.express = express_1.default();
        this.middleware();
        this.routes();
        connect_1.default(config_1.db);
    }
    routes() {
        this.express.use(body_parser_1.default.json());
        this.express.use(body_parser_1.default.urlencoded({ extended: true }));
        this.express.use(body_parser_1.default.text());
        this.express.set('view engine', 'pug');
        this.express.set('views', path_1.default.join(__dirname, '../views'));
        this.express.use(morgan_1.default('dev'));
        this.express.use(cookie_parser_1.default());
        this.express.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
        this.express.use('/', routes_1.default);
        this.express.use('/users', users_1.default);
        // catch 404 and forward to error handler
        this.express.use(function (req, res, next) {
            next(http_errors_1.default(404));
        });
        this.express.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }
    middleware() {
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.express.use(cors_1.default());
    }
}
exports.App = App;
exports.default = new App().express;
//# sourceMappingURL=app.js.map