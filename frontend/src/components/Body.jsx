import React from 'react'
import Navbar from './Navbar'
import { Outlet, useNavigate } from "react-router-dom";
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { BASE_URL } from '../utils/constant';
import { addUser } from '../utils/userSlice';
import { useEffect } from 'react';

const Body = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const userData=useSelector(store=>store.user)
  const fetchUser=async ()=>{
    if(userData) return;
    try{
      const res=await axios.get(BASE_URL+"/profile",{
        withCredentials:true
      })
      dispatch(addUser(res.data.data))

    }
    catch(err){
      if(err.status===401){
        navigate("/login")
      }
      console.log(err.message)
    }
  }

  useEffect(()=>{
    fetchUser()
  },[])
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default Body