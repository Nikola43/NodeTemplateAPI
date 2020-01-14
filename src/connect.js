"use strict";
exports.__esModule = true;
var Sequelize = require('sequelize');
var DBConnection = /** @class */ (function () {
    function DBConnection() {
        this.sequelize = new Sequelize('wsdb', 'root', '', {
            host: 'localhost',
            dialect: 'mysql'
        });
        this.connect();
    }
    Object.defineProperty(DBConnection.prototype, "getSequelize", {
        get: function () {
            return this.sequelize;
        },
        enumerable: true,
        configurable: true
    });
    DBConnection.prototype.connect = function () {
        this.sequelize
            .authenticate()
            .then(function () {
            console.log('Connection has been established successfully.');
        })["catch"](function (err) {
            console.error('Unable to connect to the database:', err);
        });
    };
    return DBConnection;
}());
exports.DBConnection = DBConnection;
var dbConnection = new DBConnection();
exports["default"] = dbConnection;
