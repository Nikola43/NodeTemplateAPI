
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import path from 'path';
import logger from 'morgan';
import bodyParser from "body-parser";
import cors from "cors";
import indexRouter from './routes/Index';
import usersRouter from './routes/Users';
import markersRouter from './routes/MarkersRoutes';
import panicButtonsRouter from './routes/PanicButtons';
import centersRouter from './routes/Centers';
import coordinateRouter from './routes/Coordinates';
import centersTypesRouter from './routes/CentersTypes';
import devicesTypesRouter from './routes/DevicesTypes';
import devicesRouter from './routes/Devices';
import documentsRouter from './routes/Documents';
import documentsTypesRouter from './routes/DocumentsTypes';
import incidencesRouter from './routes/Incidences';
import incidencesTypesRouter from './routes/IncidencesType';
import locationsRouter from './routes/Locations';
import locationsTypesRouter from './routes/LocationsType';
import multimediaContentsRouter from './routes/MultimediaContents';
import multimediaContentsTypesRouter from './routes/MultimediaContentsType';
import resourcesRouter from './routes/Resources';
import resourcesTypesRouter from './routes/ResourcesType';
import usersIncidencesRouter from './routes/UsersIncidencesRoutes';
import express from 'express';
import dbConnection from "./managers/DBManager";
import fileUpload from 'express-fileupload';

export class App {
    public express: express.Application;
    public db: any;
    private apiBaseUrl = "/api/v1";

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.db = dbConnection
    }

    private routes(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: true}));
        this.express.use(bodyParser.text());
        this.express.set('view engine', 'pug');
        this.express.set('views', path.join(__dirname, '../views'));
        this.express.use(logger('dev'));
        this.express.use(cookieParser());
        this.express.use(express.static(path.join(__dirname, '../public')));
        this.express.use(fileUpload());

        this.express.use(indexRouter);
        this.express.use(this.apiBaseUrl + "/markers", markersRouter);
        this.express.use(this.apiBaseUrl + "/users", usersRouter);
        this.express.use(this.apiBaseUrl + "/panic_buttons", panicButtonsRouter);
        this.express.use(this.apiBaseUrl + '/centers', centersRouter);
        this.express.use(this.apiBaseUrl + '/centers_types', centersTypesRouter);
        this.express.use(this.apiBaseUrl + '/coordinates', coordinateRouter);
        this.express.use(this.apiBaseUrl + '/devices', devicesRouter);
        this.express.use(this.apiBaseUrl + '/devices_types', devicesTypesRouter);
        this.express.use(this.apiBaseUrl + '/documents', documentsRouter);
        this.express.use(this.apiBaseUrl + '/documents_types', documentsTypesRouter);
        this.express.use(this.apiBaseUrl + '/incidences', incidencesRouter);
        this.express.use(this.apiBaseUrl + '/incidences_types', incidencesTypesRouter);
        this.express.use(this.apiBaseUrl + '/locations', locationsRouter);
        this.express.use(this.apiBaseUrl + '/locations_types', locationsTypesRouter);
        this.express.use(this.apiBaseUrl + '/multimedia_contents', multimediaContentsRouter);
        this.express.use(this.apiBaseUrl + '/multimedia_contents_types', multimediaContentsTypesRouter);
        this.express.use(this.apiBaseUrl + '/resources',resourcesRouter);
        this.express.use(this.apiBaseUrl + '/resources_types', resourcesTypesRouter);
        this.express.use(this.apiBaseUrl + '/users_incidences', usersIncidencesRouter);

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
