import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"

export const useSocket = () => {

    const socket = useRef(io("http://localhost:8080/stream",{
        autoConnect: false
    }));
    console.log("abc")

    const roomRef = useRef<string>();

    const [isConnected, setIsConnected] = useState(socket.current.connected);


    useEffect(() => {
        socket.current.connect();

        function onConnect() {
          setIsConnected(true);
        //   socket.current.emit("hi",1);
        }
    
        function onDisconnect() {
          setIsConnected(false);
        }
    
        function onPingEvent(value: string) {
        //   setFooEvents(previous => [...previous, value]);
        console.log(value);
        }
    
        socket.current.on('connect', onConnect);
        socket.current.on('disconnect', onDisconnect);
        socket.current.on('ping', onPingEvent);
        socket.current.on('offer',(data)=>{
            console.log(data);
        })
    
        return () => {
            socket.current.disconnect();
          socket.current.off('connect', onConnect);
          socket.current.off('disconnect', onDisconnect);
          socket.current.off('ping', onPingEvent);
        };
      }, []);

      const joinRoom = (roomName: string) => {
        roomRef.current=roomName;
        socket.current.emit("join-stream",roomName);
      }

    //   const sendOffer = (offer: string) => {
    //     socket.current.emit("offer",{
    //         offer, room
    //     })
    //   }
    const sendMessageToPeer = (msgIdf:string,message:string) => {
        socket.current.emit(msgIdf,{
            room:roomRef.current,
            message
        });
    }

    const connectListner = (event:string, handler: (data:any)=>void) => {
        socket.current.on(event,handler);
    }

      return {
        joinRoom,
        sendMessageToPeer,
        connectListner
      }
}