"use strict";
exports.__esModule = true;
var connect_1 = require("./connect");
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
// @ts-ignore
var cors = require("cors");
var config_1 = require("./config/config");
var routes_1 = require("./routes");
var users_1 = require("./routes/users");
var express = require("express");
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        this.router = express.Router();
        this.middleware();
        this.routes();
        connect_1["default"](config_1["default"].ApiConfig);
    }
    App.prototype.routes = function () {
        this.router.use(bodyParser.json());
        this.router.use(bodyParser.urlencoded({ extended: true }));
        this.express.set('views', path.join(__dirname, 'views'));
        this.express.set('view engine', 'pug');
        this.router.use(logger('dev'));
        this.router.use(express.json());
        this.router.use(express.urlencoded({ extended: false }));
        this.router.use(cookieParser());
        this.router.use(express.static(path.join(__dirname, 'public')));
        this.router.use('/', routes_1["default"]);
        this.router.use('/users', users_1["default"]);
        // catch 404 and forward to error handler
        this.router.use(function (req, res, next) {
            next(createError(404));
        });
        /*
    // error handler
        this.router.use(function(err:any, req: Request, res:Response, next:any) {
          // set locals, only providing error in development
          res.locals.message = err.message;
          res.locals.error = req.app.get('env') === 'development' ? err : {};
    
          // render the error page
          res.status(err.status || 500);
          res.render('error');
        });
        */
    };
    App.prototype.middleware = function () {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.text());
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.express.use(cors());
    };
    return App;
}());
exports.App = App;
exports["default"] = new App().express;
