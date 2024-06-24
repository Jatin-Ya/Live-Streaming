import { useEffect, useRef } from "react";

type SocketMessage = {
    message: string
}

export const useWebRTC = (sendMessageToPeer: (idf:string,message:string)=> void, connectListner: (event: string,handler: (data:any)=>void)=>void) => {
//     let peerConnection : RTCPeerConnection;
// let localStream : MediaStream;
// let remoteStream : MediaStream;
    const localStream = useRef<MediaStream>();
    const remoteStream = useRef<MediaStream>();
    const servers = { iceServers: [ { urls: ['stun:stun1.l.google.com:19302', 'stun:stun3.l.google.com:19302'] } ] }
    const peerConnection = useRef<RTCPeerConnection>();

    useEffect(()=>{
        const init = async () => {
            localStream.current = await navigator.mediaDevices.getUserMedia({video:true, audio:false});
            console.log("stream init");
            connectListner('offer',offerHandler);
            connectListner('candidate',candidateHandler);
            connectListner('answer',answerHandler);
        }
        init();
    },[])

    // handlers for message from peer
    const candidateHandler = (data: SocketMessage) => {
        const {message} = data;
        peerConnection.current?.addIceCandidate(JSON.parse(message));
    }

    const offerHandler = async (data: SocketMessage) => {
        const {message} =data;
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
        createOffer,
        localStream,
        remoteStream,
        addStream
    }

}