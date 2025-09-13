import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Body from './components/Body'
import MailVerificationPage from './pages/MailVerificationPage'
import ProfilePage from './pages/ProfilePage'
import MessagePage from './pages/MessagePage'
import Connections from './components/Connections'
import Requests from './components/Requests'
import { Provider, useSelector } from 'react-redux'
import appStore from './utils/appStore'
import Feed from './components/Feed'

const HomeRedirect = () => {
  const user = useSelector(state => state.user) // Adjust this path based on your store structure

  // If no user data, redirect to login, else redirect to feed
  if (!user) {
    return <Navigate to="/login" replace />
  } else {
    return <Navigate to="/feed" replace />
  }
}

const LoginPageWrapper = () => {
  const tokenStorage = localStorage.getItem('token')
  const token = tokenStorage

  if (token) {
    return <Navigate to="/feed" replace />
  }

  return <LoginPage />
}


const App = () => {

  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/" element={<Body/>}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="login" element={<LoginPageWrapper />} />
            <Route path="/verify" element={<MailVerificationPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/connections" element={<Connections/>}/>
            <Route path="/requests" element={<Requests/>}/>
            <Route path="/chat/:id" element={<MessagePage />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
