"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = __importDefault(require("socket.io"));
class Server {
    constructor() {
        this.port = this.normalizePort(process.env.PORT || 3000);
        app_1.default.set('port', this.port);
        this.server = http.createServer(app_1.default);
        this.io = socket_io_1.default("http://localhost:3000");
        this.configSocket();
        this.server.listen(this.port, '0.0.0.0')
            .on('error', this.onError)
            .on('listening', () => {
            this.onListening(this.server);
        });
    }
    configSocket() {
        //const io = this.io;
        /*
        io.on('connection', (socket: any) => {
            console.log('Socket ON');
            socket.on('eventDB', (emit: Emit) => {
                io.emit('eventDB', emit)
            });

            socket.on('nuevo mensaje', function (msj: any) {
                io.emit('nuevo mensaje', msj);
            });

            socket.on('disconnect', function () {
                console.log('Usuario desconectado');
            });
        });
        */
    }
    normalizePort(val) {
        let port = (typeof val === 'string') ? parseInt(val, 10) : val;
        if (isNaN(port))
            return val;
        else if (port >= 0)
            return port;
        else
            return false;
    }
    onError(error) {
        if (error.syscall !== 'listen')
            throw error;
        const port = this.normalizePort(process.env.PORT || 3000);
        let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    onListening(server) {
        let addr = server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`listening on ${bind}`);
    }
}
exports.Server = Server;
const server = new Server();
exports.default = server;
//# sourceMappingURL=server.js.map