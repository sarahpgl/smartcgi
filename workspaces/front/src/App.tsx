import { RecoilRoot } from 'recoil'
import React from 'react'
import { useEffect } from 'react';
import {BrowserRouter,Navigate,Route,Routes} from 'react-router-dom';
import Register from './js/pages/register/register'
import Home from './js/pages/home/home'
import CreateGame from './js/pages/createGame/createGame'
import JoinGame from './js/pages/joinGame/joinGame'
import Lobby from './js/pages/lobby/lobby'
import PageTest from './js/pages/test/test'
import Menu from './js/pages/menu/menu'
import './CSS/App.css'
import { SocketManagerProvider } from './components/websocket/SocketManagerProvider'
import Test from './components/game/test'

function App() {
  return (
    <BrowserRouter>
    <Routes>
<<<<<<< Updated upstream
        <Route path="/menu" element={<Menu />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/createGame" element={<CreateGame />} />
        <Route path="/joinGame" element={<JoinGame />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/test" element={<PageTest />} />
=======
      <Route path="/menu" element={<Menu />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/createGame" element={<CreateGame />} />
      <Route path="/joinGame" element={<JoinGame />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/" element={<Navigate to="/register" />} />
>>>>>>> Stashed changes
    
    </Routes>
    
    </BrowserRouter>

  )
}

export default App
