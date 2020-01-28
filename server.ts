import * as http from 'http';
import App from './app';
import socketIO from 'socket.io'
import {EmitModel} from "./db/models/EmitModel";


export class Server {
    public port: any;
    public server: any;
    public io: any;

    constructor() {
        this.port = this.normalizePort(process.env.PORT || 3000);
        App.set('port', this.port);
        this.server = http.createServer(App);
        this.io = socketIO(this.server);
        this.configSocket();
        this.server.listen(this.port, '0.0.0.0')
            .on('error', this.onError)
            .on('listening', () => {
                this.onListening(this.server);
            });
    }

    configSocket() {
        const io = this.io;

        io.on('connection', (socket: any) => {
            console.log('Socket ON');
            socket.on('DBEvent', (emit: EmitModel) => {
                io.emit('DBEvent', emit)
            });

            socket.on('nuevo mensaje', function (msj: any) {
                io.emit('nuevo mensaje', msj);
            });

            socket.on('disconnect', function () {
                console.log('Usuario desconectado');
            });
        });
    }

    normalizePort(val: number | string): number | string | boolean {
        let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
        if (isNaN(port)) return val;
        else if (port >= 0) return port;
        else return false;
    }

    onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') throw error;
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

    onListening(server: any): void {
        let addr = server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`listening on ${bind}`);
    }
}

const server = new Server();
export default server;
