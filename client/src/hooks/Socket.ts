import { useEffect, useRef, useState } from "react"
import { WebSocket } from "../Socket/socket";

export const useSocket = () => {

    const socketObjRef = useRef(WebSocket.getInstance());
    console.log("abc")

    const roomRef = useRef<string>();

    const [isConnected, setIsConnected] = useState(socketObjRef.current.socket.connected);


    useEffect(() => {
        socketObjRef.current.socket.connect();

        function onConnect() {
          setIsConnected(true);
        //   socketObjRef.current.socket.emit("hi",1);
        }
    
        function onDisconnect() {
          setIsConnected(false);
        }
    
        function onPingEvent(value: string) {
        //   setFooEvents(previous => [...previous, value]);
        console.log(value);
        }
    
        socketObjRef.current.socket.on('connect', onConnect);
        socketObjRef.current.socket.on('disconnect', onDisconnect);
        socketObjRef.current.socket.on('ping', onPingEvent);
        socketObjRef.current.socket.on('offer',(data)=>{
            console.log(data);
        })
    
        return () => {
            socketObjRef.current.socket.disconnect();
          socketObjRef.current.socket.off('connect', onConnect);
          socketObjRef.current.socket.off('disconnect', onDisconnect);
          socketObjRef.current.socket.off('ping', onPingEvent);
        };
      }, []);

      const joinRoom = (roomName: string) => {
        roomRef.current=roomName;
        socketObjRef.current.socket.emit("join-stream",roomName);
      }

    //   const sendOffer = (offer: string) => {
    //     socketObjRef.current.socket.emit("offer",{
    //         offer, room
    //     })
    //   }
    const sendMessageToPeer = (msgIdf:string,message:string) => {
        socketObjRef.current.socket.emit(msgIdf,{
            room:roomRef.current,
            message
        });
    }

    const connectListner = (event:string, handler: (data:any)=>void) => {
        socketObjRef.current.socket.on(event,handler);
    }

      return {
        joinRoom,
        sendMessageToPeer,
        connectListner
      }
}