import socketIO from "socket.io";
import {EmitModel} from "../db/models/EmitModel";
import DBActions from "../constants/DBActions";
import server from "../server";

export class SocketManager {
    public io: any;

    constructor(server: any) {
        this.io = socketIO(server);
    }

    public emitSocketEvent(eventName: string, action: string, data: any) {
        this.io.emit(eventName, new EmitModel(DBActions.INSERT, data));
    }
}

const socketManager = new SocketManager(server);
export default socketManager;
