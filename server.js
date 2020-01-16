"use strict";
exports.__esModule = true;
var http = require("http");
var app_1 = require("./app");
var socketIo = require("socket.io");
var Server = /** @class */ (function () {
    function Server() {
        var _this = this;
        this.port = this.normalizePort(process.env.PORT || 3000);
        app_1["default"].set('port', this.port);
        this.server = http.createServer(app_1["default"]);
        this.configSocket();
        this.server.listen(this.port, '0.0.0.0')
            .on('error', this.onError)
            .on('listening', function () {
            _this.onListening(_this.server);
        });
    }
    Server.prototype.configSocket = function () {
        var io = socketIo(this.server);
        io.on('connection', function (socket) {
            console.log('Socket ON');
            socket.on('eventDB', function (emit) {
                io.emit('eventDB', emit);
            });
        });
    };
    Server.prototype.normalizePort = function (val) {
        var port = (typeof val === 'string') ? parseInt(val, 10) : val;
        if (isNaN(port))
            return val;
        else if (port >= 0)
            return port;
        else
            return false;
    };
    Server.prototype.onError = function (error) {
        if (error.syscall !== 'listen')
            throw error;
        var port = this.normalizePort(process.env.PORT || 3000);
        var bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
    Server.prototype.onListening = function (server) {
        var addr = server.address();
        var bind = (typeof addr === 'string') ? "pipe " + addr : "port " + addr.port;
        console.log("listening on " + bind);
    };
    return Server;
}());
exports.Server = Server;
var srv = new Server();
