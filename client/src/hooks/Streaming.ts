import { useEffect, useRef, useState } from "react"
import { WebSocket } from "../Classes/Socket/socket"
import { WebrtcPeers } from "../Classes/WebRTC Peers/webrtc"

type SocketMessage = {
    message: string,
    userId: string
}

export const useStreaming = () => {
    const socketObjRef = useRef(WebSocket.getInstance());
    const webrtcPeersRef = useRef<WebrtcPeers>();

    const [isConnected, setIsConnected] = useState(false);
    const [peerIds,setPeerIds] = useState<string[]>([]);
    const [userId, setUserId] = useState('');
    const userIdRef = useRef('');

    useEffect(()=>{
        userIdRef.current = userId;
    },[userId])

    useEffect(()=>{
        const init = async () => {
            webrtcPeersRef.current = await WebrtcPeers.getInstance();
            socketObjRef.current = WebSocket.getInstance();
        }
        init();

        function onConnect() {
          setIsConnected(true);
        }
    
        function onDisconnect() {
          setIsConnected(false);
        }
    
        function onUsers(value: string[]) {
            console.log(value)
          const result = value.filter((val)=>{
            return val!==userIdRef.current;
        });
          setPeerIds(result)
        }

        const offerHandler = async (data: SocketMessage) => {
            const {message,userId} =data;
            const offer = JSON.parse(message);
            webrtcPeersRef.current?.createAnswer(offer,userId);
        }

        const answerHandler = (data: SocketMessage) => {
            const {message, userId} = data;
            const answer = JSON.parse(message);
            webrtcPeersRef.current?.addAnswer(answer,userId);
        }

        const candidateHandler = (data: SocketMessage) => {
            const {message, userId} = data;
            const candidate = JSON.parse(message);
            webrtcPeersRef.current?.addCandidate(candidate,userId);
        }
      
        socketObjRef.current.socket.on('connect', onConnect);
        socketObjRef.current.socket.on('disconnect', onDisconnect);
        socketObjRef.current.socket.on('users', onUsers);
        socketObjRef.current.socket.on('offer',offerHandler);
        socketObjRef.current.socket.on('answer',answerHandler);
        socketObjRef.current.socket.on('candidate',candidateHandler);
        return () => {
            socketObjRef.current.socket.disconnect();
            socketObjRef.current.socket.off('connect', onConnect);
            socketObjRef.current.socket.off('disconnect', onDisconnect);
            socketObjRef.current.socket.off('users', onUsers);
            socketObjRef.current.socket.off('offer',offerHandler);
            socketObjRef.current.socket.off('answer',answerHandler);
            socketObjRef.current.socket.off('candidate',candidateHandler);
        };

    },[]);

    useEffect(()=>{
        console.log({peerIds})
        peerIds.forEach(async (peerId)=>{
            await webrtcPeersRef.current?.createOffer(peerId);
        })
    },[peerIds])

    const joinRoom = (roomName: string) => {
        socketObjRef.current.room=roomName;
        console.log(roomName)
        socketObjRef.current.socket.emit("join-stream",{
            room: roomName,
            userId
        });
    }

    const addUser = (userId: string) => {
        socketObjRef.current.socket.emit("add-user",{userId});
    }

    return {
        localStream: webrtcPeersRef.current?.localStream,
        remoteStreams: webrtcPeersRef.current?.getRemoteStreams(),
        joinRoom,
        peerIds,
        userId,
        setUserId,
        addUser
    }
}