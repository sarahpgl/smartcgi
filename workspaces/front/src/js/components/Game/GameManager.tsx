import useSocketManager from '@hooks/useSocketManager';
import { useEffect } from 'react';
import { Listener } from '@components/websocket/types';
import { useRecoilState } from 'recoil';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CurrentLobbyState, CurrentGameState, CurrentSensibilisationQuestion, CurrentPracticeQuestion } from './states';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import LobbyComponent from '../LobbyComponent/LobbyComponent';
import { ClientEvents } from '@shared/client/ClientEvents';

export default function GameManager() {
  const { sm, socket } = useSocketManager();
  const naviguate = useNavigate();
  const location = useLocation();
  const isLobbyPath = location.pathname.includes('/lobby');

  const [lobbyState, setLobbyState] = useRecoilState(CurrentLobbyState);
  const [gameState, setGameState] = useRecoilState(CurrentGameState);
  const [sensibilisationQuestion, setSensibilisationQuestion] = useRecoilState(CurrentSensibilisationQuestion)
  const [practiceQuestion, setPracticeQuestion] = useRecoilState(CurrentPracticeQuestion);

  useEffect(() => {
    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = async (data) => {
      if (!location.pathname.includes('/game')) {
        console.log(data);
        setLobbyState(data);
        if (!location.pathname.includes('/lobby')) {
          naviguate(`/lobby/${data.lobbyId}`);
        }
      }
    };

    const onGameState: Listener<ServerPayloads[ServerEvents.GameState]> = (data) => {
      console.log(data);
      setGameState(data);
    };

    const onLobbyJoined: Listener<ServerPayloads[ServerEvents.LobbyJoined]> = (data) => {
      localStorage.setItem('clientInGameId', data.clientInGameId);
    };

    const onGameStart: Listener<ServerPayloads[ServerEvents.GameStart]> = (data) => {
      console.log(data);
      setGameState(data.gameState);
      setSensibilisationQuestion(data.sensibilisationQuestion);
      naviguate('/game/');
    };

    const onPracticeQuestion: Listener<ServerPayloads[ServerEvents.PracticeQuestion]> = (data) => {
      setPracticeQuestion(data);
    }

    const onGetSensibilisationQuestion: Listener<ServerPayloads[ServerEvents.SensibilisationQuestion]> = (data) => {
      setSensibilisationQuestion(data);
    };

    const onSensibilisationAnswered: Listener<ServerPayloads[ServerEvents.SensibilisationAnswered]> = () => {
      setSensibilisationQuestion(null);
    }


    if (!socket.connected) {
      sm.connect();
    }
    if (!sm.socket.hasListeners(ServerEvents.LobbyState)) sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    if (!sm.socket.hasListeners(ServerEvents.LobbyJoined)) sm.registerListener(ServerEvents.LobbyJoined, onLobbyJoined);
    if (!sm.socket.hasListeners(ServerEvents.GameState)) sm.registerListener(ServerEvents.GameState, onGameState);
    if (!sm.socket.hasListeners(ServerEvents.GameStart)) sm.registerListener(ServerEvents.GameStart, onGameStart);
    if (!sm.socket.hasListeners(ServerEvents.PracticeQuestion)) sm.registerListener(ServerEvents.PracticeQuestion, onPracticeQuestion);
    if (!sm.socket.hasListeners(ServerEvents.SensibilisationQuestion)) sm.registerListener(ServerEvents.SensibilisationQuestion, onGetSensibilisationQuestion);
    if (!sm.socket.hasListeners(ServerEvents.SensibilisationAnswered)) sm.registerListener(ServerEvents.SensibilisationAnswered, onSensibilisationAnswered);

    return () => {
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.LobbyJoined, onLobbyJoined);
      sm.removeListener(ServerEvents.GameState, onGameState);
      sm.removeListener(ServerEvents.GameStart, onGameStart);
      sm.removeListener(ServerEvents.PracticeQuestion, onPracticeQuestion);
      sm.removeListener(ServerEvents.SensibilisationQuestion, onGetSensibilisationQuestion);
      sm.removeListener(ServerEvents.SensibilisationAnswered, onSensibilisationAnswered);
    };
  }, []);

  if (!lobbyState) {
    return <></>
  }
  if (!gameState && isLobbyPath) {
    return <LobbyComponent />
  }

  return <div></div>

}
