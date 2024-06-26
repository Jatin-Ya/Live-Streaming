import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useStreaming } from './hooks/Streaming';
import CreateStream from './components/createStream';
import DisplayVideo from './components/DisplayVideo';

function App() {
  const localVideoRef = useRef<any>();
  const [videoState, setVideoState] = useState();
  // const remoteVideoRef = useRef<any>();
  // const remoteVideosRef = useRef<>();
  // const {joinRoom, sendMessageToPeer, connectListner} = useSocket();
  // const {createOffer, localStream, remoteStream, addStream} = useWebRTC(sendMessageToPeer, connectListner);
  // const [userId, setUserId] = useState("");
  const {localStream, remoteStreams, joinRoom, peerIds, userId, setUserId, addUser } = useStreaming();
  // const { localStream, remoteStream, joinRoom, createOffer} = useStreaming();
  const [click,setClick] = useState(true);

  // useEffect(()=>{
  //   // localVideoRef.current.srcObject = localStream;
  //   // remoteStreams?.forEach((remoteStream)=>{
  //   //   const vid = new HTMLVideoElement()
  //   //   vid.srcObject=remoteStream.stream
  //   //   // remoteVideosRef.current?.push(vid);
  //   // })
  //   // remoteVideoRef.current.srcObject = remoteStream.current;
  //   // console.log(localStream,remoteStream.current);
  //   // if (localStream) setVideoState(window.URL.createObjectURL(localStream));
  // },[click])

  // useEffect(() => {
  //   navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  //     localVideoRef.current.srcObject = stream;
  //   });
  // }, []);

  return (
    <div className="App">
      <h5>Enter UserId</h5>
      <input value={userId} onChange={(evnt)=>setUserId(evnt.target.value)}></input>
      <button onClick={()=> addUser(userId)}>Add User</button>
      <CreateStream joinRoom={joinRoom}></CreateStream>
      {/* <button onClick={()=>{joinRoom("abc")}}> Join abc</button> */}
      {/* <button onClick={()=>{createOffer()}}> createOffer</button> */}
      {/* <video
        ref={localVideoRef}
        autoPlay={true}
        style={{height:"100px",width:"200px",background:"black"}}
      ></video> */}
      <DisplayVideo stream={localStream} />

      {
        remoteStreams?.map((stream, idx)=> {
          return <DisplayVideo key={idx} stream={stream.stream} />
        })
      }
      
      {/* <video
        ref={remoteVideoRef}
        autoPlay={true}
        
        style={{height:"100px",width:"200px",background:"black"}}
      ></video> */}
      <button onClick={()=> setClick((prev)=> !prev)}>refresh</button>
      {/* <button onClick={addStream} >add stram</button> */}
    </div>
  );
}

export default App;
