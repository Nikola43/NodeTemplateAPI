"use strict";
exports.__esModule = true;
var http_errors_1 = require("http-errors");
var cookie_parser_1 = require("cookie-parser");
var path_1 = require("path");
var morgan_1 = require("morgan");
var body_parser_1 = require("body-parser");
var cors_1 = require("cors");
var routes_1 = require("./routes");
var users_1 = require("./routes/users");
var express_1 = require("express");
var connect_1 = require("./connect");
var App = /** @class */ (function () {
    function App() {
        this.express = express_1["default"]();
        this.middleware();
        this.routes();
        this.db = connect_1["default"];
    }
    App.prototype.routes = function () {
        this.express.use(body_parser_1["default"].json());
        this.express.use(body_parser_1["default"].urlencoded({ extended: true }));
        this.express.use(body_parser_1["default"].text());
        this.express.set('view engine', 'pug');
        this.express.set('views', path_1["default"].join(__dirname, '../views'));
        this.express.use(morgan_1["default"]('dev'));
        this.express.use(cookie_parser_1["default"]());
        this.express.use(express_1["default"].static(path_1["default"].join(__dirname, '../public')));
        this.express.use('/', routes_1["default"]);
        this.express.use('/users', users_1["default"]);
        // catch 404 and forward to error handler
        this.express.use(function (req, res, next) {
            next(http_errors_1["default"](404));
        });
        this.express.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    };
    App.prototype.middleware = function () {
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.express.use(cors_1["default"]());
    };
    return App;
}());
exports.App = App;
exports["default"] = new App().express;
