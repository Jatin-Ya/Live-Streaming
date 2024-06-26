import { Socket } from "socket.io";
import MySocketInterface from "./socketInterface";
import Websocket from "./socket";

class StreamerSocket implements MySocketInterface {
    private uId_sId: { [userId: string]: string; };
    private rId_uIds: { [roomId: string]: string[]; };

    constructor(){
        this.uId_sId={}
        this.rId_uIds={}
    }

   handleConnection(socket: Socket) {
        console.log("connected")
        socket.on("hi",(val)=> console.log(val));
        socket.emit('ping', 'Hi! I am a live socket connection');

        socket.on("add-user",(data:any)=> {
            const {userId} = data;
            console.log("add-user ",userId)
            this.uId_sId[userId]=socket.id;
        })
        socket.on("disconnect",()=>{
            const myId = Object.keys(this.uId_sId).filter((val)=>this.uId_sId[val]===socket.id)[0];
            console.log("disconnecting ",myId);
            delete this.uId_sId[myId];
        })
        socket.on("join-stream",(data:any)=> {
            const {room, userId} = data;
            console.log(data);
            
            if (!this.rId_uIds[room])
                this.rId_uIds[room]=[userId]
            else
                this.rId_uIds[room].push(userId);
            socket.join(room);
            socket.emit("users",this.rId_uIds[room]);
        })
        socket.on("offer",(data)=> {
            const {message, peerId} = data;
            console.log("offer",data);
            const myId = Object.keys(this.uId_sId).filter((val)=>this.uId_sId[val]===socket.id)[0];
            const sockId = this.uId_sId[peerId];
            socket.to(sockId).emit("offer",{message,userId:myId});
        })
        socket.on("candidate",(data)=> {
            const {message, peerId} = data;
            console.log("candidate",data);
            const myId = Object.keys(this.uId_sId).filter((val)=>this.uId_sId[val]===socket.id)[0];
            const sockId = this.uId_sId[peerId];
            socket.to(sockId).emit("candidate",{message,userId:myId});
        })
        socket.on("answer",(data)=> {
            const {message, peerId} = data;
            console.log("answer",data);
            const myId = Object.keys(this.uId_sId).filter((val)=>this.uId_sId[val]===socket.id)[0];
            const sockId = this.uId_sId[peerId];
            socket.to(sockId).emit("answer",{message,userId:myId});
        })
    }

   middlewareImplementation(socket: Socket, next: any) {
       //Implement your middleware for orders here
       console.log("In socket middleware");
       return next();
   }

   
}

export default StreamerSocket;