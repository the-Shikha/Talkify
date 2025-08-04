import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Body from './components/Body'
import MailVerificationPage from './pages/MailVerificationPage'
import ProfilePage from './pages/ProfilePage'
import MessagePage from './pages/MessagePage'


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body/>}>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/verify" element={<MailVerificationPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/message" element={<MessagePage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
