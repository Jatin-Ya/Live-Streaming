import { useState } from "react"

const CreateStream = ({joinRoom}:any) => {
    const [streamName, setStreamName] = useState("");
    return (
        <div>
            <h5>Enter Stream name : </h5>
            <input value={streamName} onChange={(evnt)=> setStreamName(evnt.target.value)}></input>
            <button disabled={!streamName} onClick={()=>{joinRoom(streamName)}}>Create</button>
        </div>
    )
}

export default CreateStream;