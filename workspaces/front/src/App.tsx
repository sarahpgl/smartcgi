import { RecoilRoot } from 'recoil'
import React from 'react'
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Register from './js/pages/register/register'
import Home from './js/pages/home/home'
import CreateGame from './js/pages/createGame/createGame'
import JoinGame from './js/pages/joinGame/joinGame'
import Lobby from './js/pages/lobby/lobby'
import PageTest from './js/pages/test/test'
import Menu from './js/pages/menu/menu'
import Game from './js/pages/game/game'
import Rules from './js/pages/rules/rules'

import './CSS/App.css'
import { SocketManagerProvider } from '@components/websocket/SocketManagerProvider'
import Test from './components/game/test'
import RequireAuth from './components/auth/RequireAuth';

function App() {

  return (
    <RecoilRoot>
      <SocketManagerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route
              path="/menu"
              element={
                <RequireAuth>
                  <Menu />
                </RequireAuth>
              }
            />
            <Route
              path="/createGame"
              element={
                <RequireAuth>
                  <CreateGame />
                </RequireAuth>
              }
            />
            <Route
              path="/joinGame"
              element={
                <RequireAuth>
                  <JoinGame />
                </RequireAuth>
              }
            />
            <Route
              path="/lobby/:lobbyId"
              element={
                <RequireAuth>
                  <Lobby />
                </RequireAuth>
              }
            />
            <Route
              path="/game"
              element={
                <RequireAuth>
                  <Game />
                </RequireAuth>
              }
            />


            <Route path="/home" element={<Home />} />
            <Route path="/test" element={<PageTest />} />
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/rules" element={<Rules />} />
          </Routes>

        </BrowserRouter>
      </SocketManagerProvider>
    </RecoilRoot>
  )
}

export default App
