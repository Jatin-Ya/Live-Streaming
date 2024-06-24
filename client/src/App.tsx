import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useSocket } from './hooks/Socket';
import { useWebRTC } from './hooks/WebRTC';
import { useStreaming } from './hooks/Streaming';

function App() {
  const localVideoRef = useRef<any>();
  const [videoState, setVideoState] = useState();
  const remoteVideoRef = useRef<any>();
  const {joinRoom, sendMessageToPeer, connectListner} = useSocket();
  const {createOffer, localStream, remoteStream, addStream} = useWebRTC(sendMessageToPeer, connectListner);
  // const { localStream, remoteStream, joinRoom, createOffer} = useStreaming();
  const [click,setClick] = useState(true);

  useEffect(()=>{
    localVideoRef.current.srcObject = localStream.current;
    remoteVideoRef.current.srcObject = remoteStream.current;
    console.log(localStream.current,remoteStream.current);
    // if (localStream.current) setVideoState(window.URL.createObjectURL(localStream.current));
  },[click])

  // useEffect(() => {
  //   navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  //     localVideoRef.current.srcObject = stream;
  //   });
  // }, []);

  return (
    <div className="App">
      <button onClick={()=>{joinRoom("abc")}}> Join abc</button>
      <button onClick={()=>{createOffer()}}> createOffer</button>
      <video
        ref={localVideoRef}
        autoPlay={true}
        style={{height:"100px",width:"200px",background:"black"}}
      ></video>
      <video
        ref={remoteVideoRef}
        autoPlay={true}
        
        style={{height:"100px",width:"200px",background:"black"}}
      ></video>
      <button onClick={()=> setClick((prev)=> !prev)}>refresh</button>
      {/* <button onClick={addStream} >add stram</button> */}
    </div>
  );
}

export default App;
