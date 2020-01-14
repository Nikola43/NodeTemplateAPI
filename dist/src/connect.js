"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require('sequelize');
class DBConnection {
    constructor() {
        this.sequelize = new Sequelize('wsdb', 'root', '', {
            host: 'localhost',
            dialect: 'mysql',
        });
        this.connect();
    }
    get getSequelize() {
        return this.sequelize;
    }
    connect() {
        this.sequelize
            .authenticate()
            .then(() => {
            console.log('Connection has been established successfully.');
        })
            .catch((err) => {
            console.error('Unable to connect to the database:', err);
        });
    }
}
exports.DBConnection = DBConnection;
let dbConnection = new DBConnection();
exports.default = dbConnection;
//# sourceMappingURL=connect.js.map