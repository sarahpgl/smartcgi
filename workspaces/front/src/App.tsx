import { RecoilRoot } from 'recoil'

import React from 'react'
import { useEffect } from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Register from './js/pages/register/register'
import Home from './js/pages/home/home'
import './CSS/App.css'
import { SocketManagerProvider } from './components/websocket/SocketManagerProvider'
import Test from './components/game/test'

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
    
    </Routes>
    
    </BrowserRouter>

  )
}

export default App
