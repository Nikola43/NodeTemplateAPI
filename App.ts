import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import path from 'path';
import logger from 'morgan';
import bodyParser from "body-parser";
import cors from "cors";
import indexRouter from './src/routes/Index';
import usersRouter from './src/routes/Users';
import centersRouter from './src/routes/Centers';
import coordinateRouter from './src/routes/Coordinates';
import centersTypesRouter from './src/routes/CentersTypes';
import devicesTypesRouter from './src/routes/DevicesTypes';
import documentsRouter from './src/routes/Documents';
import documentsTypesRouter from './src/routes/DocumentsTypes';
import incidencesRouter from './src/routes/Incidences';
import incidencesTypesRouter from './src/routes/IncidencesType';
import express from 'express';
import dbConnection from "./src/utils/DBUtil";


export class App {
    public express: express.Application;
    public db: any;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.db = dbConnection
    }

    private routes(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.text());
        this.express.set('view engine', 'pug');
        this.express.set('views', path.join(__dirname, '../views'));
        this.express.use(logger('dev'));
        this.express.use(cookieParser());
        this.express.use(express.static(path.join(__dirname, '../public')));

        this.express.use('/', indexRouter);
        this.express.use('/users', usersRouter);
        this.express.use('/centers', centersRouter);
        this.express.use('/centers_types', centersTypesRouter);
        this.express.use('/coordinates', coordinateRouter);
        this.express.use('/devices_types', devicesTypesRouter);
        this.express.use('/documents', documentsRouter);
        this.express.use('/documents_types', documentsTypesRouter);
        this.express.use('/incidences', incidencesRouter);
        this.express.use('/incidences_types', incidencesTypesRouter);

        // catch 404 and forward to error handler
        this.express.use(function (req, res, next) {
            next(createError(404));
        });

        this.express.use(function (err: any, req: any, res: any, next: any) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }

    private middleware(): void {
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.express.use(cors());
    }
}

export default new App().express;
