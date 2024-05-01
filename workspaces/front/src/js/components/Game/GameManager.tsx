import useSocketManager from '@hooks/useSocketManager';
import { useEffect } from 'react';
import { Listener } from '@components/websocket/types';
import { useRecoilState } from 'recoil';
import { useLocation, useNavigate } from 'react-router-dom';
import { CurrentLobbyState, CurrentGameState } from './states';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import LobbyComponent from '../LobbyComponent/LobbyComponent';

export default function GameManager() {
  const { sm, socket } = useSocketManager();
  const naviguate = useNavigate();
  const location = useLocation();

  const [lobbyState, setLobbyState] = useRecoilState(CurrentLobbyState);
  const [gameState, setGameState] = useRecoilState(CurrentGameState);

  useEffect(() => {
    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = async (data) => {
      console.log(data);
      setLobbyState(data);
      if (!location.pathname.includes('/lobby')) {
        naviguate(`/lobby/${data.lobbyId}`);
      }
    };

    const onGameState: Listener<ServerPayloads[ServerEvents.GameState]> = (data) => {
      setGameState(data);
    };

    const onLobbyJoined: Listener<ServerPayloads[ServerEvents.LobbyJoined]> = (data) => {
      localStorage.setItem('clientInGameId', data.clientInGameId);
    };

    if (!socket.connected) {
      sm.connect();
    }
    if (!sm.socket.hasListeners(ServerEvents.LobbyState)) sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    if (!sm.socket.hasListeners(ServerEvents.LobbyJoined)) sm.registerListener(ServerEvents.LobbyJoined, onLobbyJoined);
    if (!sm.socket.hasListeners(ServerEvents.GameState)) sm.registerListener(ServerEvents.GameState, onGameState);

    return () => {
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.GameState, onGameState);
    };
  }, []);

  if (!lobbyState) {
    return <></>
  }
  if (!gameState) {
    return <LobbyComponent />
  }

  return <div> Ceci sera le Game component </div>

}
