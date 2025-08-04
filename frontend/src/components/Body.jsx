import React from 'react'
import Navbar from './Navbar'
import { Outlet } from "react-router-dom";
import Footer from './Footer';

const Body = () => {
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