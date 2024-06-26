import { WebSocket } from "../Classes/Socket/socket"


const socket = WebSocket.getInstance();

export const sendMessageToPeer = (msgIdf:string,message:string,peerId: string) => {
    socket.socket.emit(msgIdf,{
        peerId,
        message
    });
}

export const sendMessageToRoom = (msgIdf:string,message:string) => {
    socket.socket.emit(msgIdf,{
        room:socket.room,
        message
    });
}