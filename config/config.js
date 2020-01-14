"use strict";
exports.__esModule = true;
var ApiConfig = /** @class */ (function () {
    function ApiConfig() {
        this.db = 'mongodb://localhost:27017/wasapi';
    }
    return ApiConfig;
}());
exports.ApiConfig = ApiConfig;
var usersRoutes = new ApiConfig();
exports["default"] = usersRoutes.db;
