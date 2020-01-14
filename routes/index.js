"use strict";
exports.__esModule = true;
var express_1 = require("express");
var IndexRoutes = /** @class */ (function () {
    function IndexRoutes() {
        this.router = express_1.Router();
    }
    IndexRoutes.prototype.init = function () {
        /* GET ALL USERS */
        //this.router.get("/users", UserController.getAll);
        /* GET home page. */
        this.router.get('/', function (req, res, next) {
            res.render('index', { title: 'Express' });
            // res.status(200).send("Hello");
        });
    };
    return IndexRoutes;
}());
exports.IndexRoutes = IndexRoutes;
var indexRoutes = new IndexRoutes();
indexRoutes.init();
exports["default"] = indexRoutes.router;
