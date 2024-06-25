import { Socket, io } from "socket.io-client";

export class WebSocket {
    private static _instance:WebSocket = new WebSocket();

    public socket: Socket;

    constructor() {
        if(WebSocket._instance){
            throw new Error("Error: Instantiation failed: Use WebSocket.getInstance() instead of new.");
        }
        this.socket = io("http://localhost:8080/stream",{
            autoConnect: false
        });
        WebSocket._instance = this;
    }

    public static getInstance():WebSocket
    {
        return WebSocket._instance;
    }

}