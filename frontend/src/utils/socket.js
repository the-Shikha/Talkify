// import {io} from "socket.io-client";

// export const createSocketConnection=()=>{
//     return io("http://localhost:5000");
// }


import {io} from "socket.io-client"
import { BASE_URL } from "./constant"

export const createSocketConnection=()=>{
    if(location.hostname==="localhost")
        return io(BASE_URL)
    else
        return io("http://13.60.27.96",{path:"/api/socket.io"})
}