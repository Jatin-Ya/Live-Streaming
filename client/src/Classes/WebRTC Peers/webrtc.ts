import { sendMessageToPeer } from "../../helper/socket";

const servers = { iceServers: [ { urls: ['stun:stun1.l.google.com:19302', 'stun:stun3.l.google.com:19302'] } ] }

class Peer {
    public peerConnection: RTCPeerConnection;

    constructor() {
        this.peerConnection = new RTCPeerConnection(servers);
    }
}

class RemoteStream {
    public stream: MediaStream;

    constructor(){
        this.stream= new MediaStream();
    }
}


export class WebrtcPeers {
    private static _instance:WebrtcPeers = new WebrtcPeers();

    public peers: {
        [peerId: string]: {
            peer: Peer;
            remoteStream: RemoteStream;
        }
    };
    public localStream: MediaStream;

    constructor() {
        if(WebrtcPeers._instance){
            throw new Error("Error: Instantiation failed: Use WebrtcPeers.getInstance() instead of new.");
        }
        this.peers = {};
        this.localStream = new MediaStream;
        WebrtcPeers._instance = this;
    }

    public static async getInstance():Promise<WebrtcPeers>
    {
        const instance = WebrtcPeers._instance;
        if (!instance.localStream.active)
            instance.localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false}); 
        return instance;
    }

    private createConnection = (peerId: string) => {
        this.peers[peerId] = {
            peer: new Peer(),
            remoteStream: new RemoteStream()
        }
        // const peer = new Peer();
        // const remoteStream = new RemoteStream();

        this.localStream.getTracks().forEach((track) => {
            console.log("sent stream")
            this.peers[peerId].peer.peerConnection.addTrack(track,this.localStream);
        })

        this.peers[peerId].peer.peerConnection.ontrack = async (event) => {
            console.log(event.streams);
            event.streams[0]?.getTracks().forEach((track) => {
                console.log("recieved stream")
                this.peers[peerId].remoteStream.stream.addTrack(track)
            })
        }
    
        this.peers[peerId].peer.peerConnection.onicecandidate = async (event) => {
            if(event.candidate){
                // document.getElementById(sdpType).value = JSON.stringify(peerConnection.localDescription)
                // client.sendMessageToPeer({text:JSON.stringify({'type':'candidate', 'candidate':event.candidate})}, MemberId)
                console.log({candidate:event.candidate,peerId})
                sendMessageToPeer('candidate',JSON.stringify(event.candidate),peerId);
            }
        }
    }

    public createOffer = async (peerId: string) => {
        if (this.peers[peerId]) return;
        this.createConnection(peerId);
        const offer = await this.peers[peerId].peer.peerConnection.createOffer();
        await this.peers[peerId].peer.peerConnection.setLocalDescription(offer);

        sendMessageToPeer("offer",JSON.stringify(offer),peerId);
    }

    public createAnswer = async (offer: any,peerId: string) => {
        this.createConnection(peerId);

        if(!offer) return alert('Retrieve offer from peer first...')
        await this.peers[peerId].peer.peerConnection.setRemoteDescription(offer);
        const answer = await this.peers[peerId].peer.peerConnection.createAnswer();
        await this.peers[peerId].peer.peerConnection.setLocalDescription(answer);

        sendMessageToPeer("answer",JSON.stringify(answer),peerId);
    }

    public addCandidate = (candidate:any , peerId: string) => {
        this.peers[peerId].peer.peerConnection.addIceCandidate(candidate);
    }

    public addAnswer = (answer:any, peerId: string) => {
        this.peers[peerId].peer.peerConnection.setRemoteDescription(answer);
    }

    public getRemoteStreams = () => {
        const remoteStreams: RemoteStream[] = [];
        Object.keys(this.peers).forEach((val)=>{
            remoteStreams.push(this.peers[val].remoteStream)
        });
        return remoteStreams;
    }
} 