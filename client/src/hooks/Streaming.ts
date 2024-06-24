import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"

type SocketMessage = {
    message: string
}

export const useStreaming = () => {
    const socket = useRef(io("http://localhost:8080/stream",{
        autoConnect: false
    }));
    let room: string = 'abc';
    
    

    const [isConnected, setIsConnected] = useState(socket.current.connected);

    const localStream = useRef<MediaStream>();
    const remoteStream = useRef<MediaStream>();
    const servers = { iceServers: [ { urls: ['stun:stun1.l.google.com:19302', 'stun:stun3.l.google.com:19302'] } ] }
    const peerConnection = useRef<RTCPeerConnection>();

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
        // socket.current.on('offer',(data)=>{
        //     console.log(data);
        // })
        socket.current.on('offer',offerHandler);
            socket.current.on('candidate',candidateHandler);
            socket.current.on('answer',answerHandler);
    
        return () => {
            socket.current.disconnect();
          socket.current.off('connect', onConnect);
          socket.current.off('disconnect', onDisconnect);
          socket.current.off('ping', onPingEvent);
          socket.current.off('offer',offerHandler);
            socket.current.off('candidate',candidateHandler);
            socket.current.off('answer',answerHandler);
        };
      }, []);

      const joinRoom = (roomName: string) => {
        room=roomName;
        socket.current.emit("join-stream",roomName);
      }

    //   const sendOffer = (offer: string) => {
    //     socket.current.emit("offer",{
    //         offer, room
    //     })
    //   }
    const sendMessageToPeer = (msgIdf:string,message:string) => {
        socket.current.emit(msgIdf,{
            room,
            message
        });
    }

    const connectListner = (event:string, handler: (data:any)=>void) => {
        socket.current.on(event,handler);
    }

    useEffect(()=>{
        const init = async () => {
            localStream.current = await navigator.mediaDevices.getUserMedia({video:true, audio:false});
            console.log("stream init");
            // connectListner('offer',offerHandler);
            // connectListner('candidate',candidateHandler);
            // connectListner('answer',answerHandler);
        }
        init();
    },[])

    // handlers for message from peer
    const candidateHandler = async (data: SocketMessage) => {
        const {message} = data;
        console.log("recieved candidates");
        await peerConnection.current?.addIceCandidate(JSON.parse(message));
    }

    const offerHandler = async (data: SocketMessage) => {
        const {message} =data;
        console.log("recieved offer",{message})
        if (!localStream.current){
            localStream.current = await navigator.mediaDevices.getUserMedia({video:true, audio:false});
        }
        const offer = JSON.parse(message);
        console.log({offer})
        createAnswer(offer);
    }

    const answerHandler = (data: SocketMessage) => {
        const {message} = data;
        const answer = JSON.parse(message);

        if(!peerConnection.current?.currentRemoteDescription){
            peerConnection.current?.setRemoteDescription(answer)
        }
    }

    const createAnswer = async (offer: any ) => {
        createPeerConnection();

    // let offer = document.getElementById('offer-sdp').value
    if(!offer) return alert('Retrieve offer from peer first...')

    await peerConnection.current?.setRemoteDescription(offer)
    
    let answer = await peerConnection.current?.createAnswer()
    console.log(answer);
    if (!peerConnection.current?.localDescription)
    await peerConnection.current?.setLocalDescription(answer)

    // document.getElementById('answer-sdp').value  = JSON.stringify(answer)
    // client.sendMessageToPeer({text:JSON.stringify({'type':'answer', 'answer':answer})}, MemberId)
    sendMessageToPeer('answer',JSON.stringify(answer));

    }

    const createPeerConnection = async () => {
        peerConnection.current = new RTCPeerConnection(servers)
    
        remoteStream.current = new MediaStream()
        // document.getElementById('user-2').srcObject = remoteStream.current
        
        if (localStream.current)
        localStream.current.getTracks().forEach((track) => {
            console.log("sent stream")
            if (peerConnection.current && localStream.current)
            peerConnection.current.addTrack(track, localStream.current)
        })
        
    
        peerConnection.current.ontrack = async (event) => {
            console.log(event.streams);
            event.streams[0]?.getTracks().forEach((track) => {
                console.log("recieved stream")
                if (remoteStream.current)
                remoteStream.current.addTrack(track)
            })
            // remoteVideoRef.current.srcObject = remoteStream.current;
        }
    
        peerConnection.current.onicecandidate = async (event) => {
            if(event.candidate){
                // document.getElementById(sdpType).value = JSON.stringify(peerConnection.localDescription)
                // client.sendMessageToPeer({text:JSON.stringify({'type':'candidate', 'candidate':event.candidate})}, MemberId)
                console.log({candidate:event.candidate})
                sendMessageToPeer('candidate',JSON.stringify(event.candidate));
            }
        }
    }

    const createOffer = async () => {
    
        createPeerConnection()
        let offer;
        if (peerConnection.current){
            offer = await peerConnection.current.createOffer()
            await peerConnection.current.setLocalDescription(offer)
        }
        
        sendMessageToPeer('offer',JSON.stringify(offer));
        // document.getElementById('offer-sdp').value = JSON.stringify(offer)
        // client.sendMessageToPeer({text:JSON.stringify({'type':'offer', 'offer':offer})}, MemberId)
    }

    const addStream = () => {
        if (localStream.current){
            // peerConnection.current?.removeTrack()
            localStream.current.getTracks().forEach((track) => {
                console.log("sent stream")
                if (peerConnection.current && localStream.current)
                peerConnection.current.addTrack(track, localStream.current)
            })

        }
    }

    return {
        localStream,remoteStream, createOffer, joinRoom
    }

}