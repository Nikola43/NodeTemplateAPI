"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class IndexRoutes {
    constructor() {
        this.router = express_1.Router();
    }
    init() {
        /* GET home page. */
        this.router.get('/', function (req, res, next) {
            res.render('index', { title: 'Express' });
            // res.status(200).send("Hello");
        });
    }
}
exports.IndexRoutes = IndexRoutes;
let indexRoutes = new IndexRoutes();
indexRoutes.init();
exports.default = indexRoutes.router;
//# sourceMappingURL=index.js.map