const Sequelize = require('sequelize');

export class DBConnection {
    private sequelize: any;

    constructor() {
        this.sequelize = new Sequelize('signis', 'root', '123456', {
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
            .catch((err: Error) => {
                console.error('Unable to connect to the database:', err);
            });
    }
}

let dbConnection = new DBConnection();
export default dbConnection;
