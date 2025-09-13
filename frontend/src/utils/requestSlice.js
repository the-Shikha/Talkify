import { createSlice } from "@reduxjs/toolkit";

const requestSlice=createSlice({
    name:"connectionRequest",
    initialState:null,
    reducers:{
        addConnectionRequest:(state,action)=>action.payload,
        removeConnectionRequest:(state,action)=>{
         const newArray= state.filter(r=>r._id!==action.payload)
         return newArray
        }
        
    }
})

export const {addConnectionRequest,removeConnectionRequest}=requestSlice.actions
export default requestSlice.reducer