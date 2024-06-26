import { useEffect, useRef } from "react";

const DisplayVideo = ({key='', stream}:any) => {
    const videoRef = useRef<any>();

    useEffect(()=>{
        videoRef.current.srcObject = stream;
    })

    return (
        <video
        key={key}
        ref={videoRef}
        autoPlay={true}
        style={{height:"100px",width:"200px",background:"black"}}
      ></video>
    )
}

export default DisplayVideo;