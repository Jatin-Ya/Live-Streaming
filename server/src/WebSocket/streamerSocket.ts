import { Socket } from "socket.io";
import MySocketInterface from "./socketInterface";
import Websocket from "./socket";

class StreamerSocket implements MySocketInterface {

   handleConnection(socket: Socket) {
        console.log("connected")
        socket.on("hi",(val)=> console.log(val));
        socket.emit('ping', 'Hi! I am a live socket connection');

        socket.on("join-stream",(room: string)=> {
            console.log(room);
            socket.join(room);
        })
        socket.on("offer",(data)=> {
            const {message, room} = data;
            console.log("offer",data);
            socket.to(room).emit("offer",{message});
        })
        socket.on("candidate",(data)=> {
            const {message, room} = data;
            console.log("candidate",data);
            socket.to(room).emit("candidate",{message});
        })
        socket.on("answer",(data)=> {
            const {message, room} = data;
            console.log("answer",data);
            socket.to(room).emit("answer",{message});
        })
    }

   middlewareImplementation(socket: Socket, next: any) {
       //Implement your middleware for orders here
       console.log("In socket middleware");
       return next();
   }

   
}

export default StreamerSocket;