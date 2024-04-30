import { RecoilRoot } from 'recoil'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Register from './js/pages/register/register'
import Home from './js/pages/home/home'
import CreateGame from './js/pages/createGame/createGame'
import JoinGame from './js/pages/joinGame/joinGame'
import Lobby from './js/pages/lobby/lobby'
import Menu from './js/pages/menu/menu'
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
          path="/lobby"
          element={
            <RequireAuth>
              <Lobby />
            </RequireAuth>
          }
        />


        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>

        </BrowserRouter>
      </SocketManagerProvider>

    </RecoilRoot>
  )
}

export default App
