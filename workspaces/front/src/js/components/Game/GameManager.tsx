import useSocketManager from '@hooks/useSocketManager';
import { useEffect } from 'react';
import { Listener } from '@components/websocket/types';
import { useRecoilState } from 'recoil';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CurrentLobbyState, CurrentGameState, CurrentSensibilisationQuestion, CurrentPracticeQuestion, CurrentGameReport } from './states';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import LobbyComponent from '../LobbyComponent/LobbyComponent';
import { ClientEvents } from '@shared/client/ClientEvents';
import { notifications } from '@mantine/notifications';

export default function GameManager() {
  const { sm, socket } = useSocketManager();
  const naviguate = useNavigate();
  const location = useLocation();
  const isLobbyPath = location.pathname.includes('/lobby');

  const [lobbyState, setLobbyState] = useRecoilState(CurrentLobbyState);
  const [gameState, setGameState] = useRecoilState(CurrentGameState);
  const [sensibilisationQuestion, setSensibilisationQuestion] = useRecoilState(CurrentSensibilisationQuestion)
  const [practiceQuestion, setPracticeQuestion] = useRecoilState(CurrentPracticeQuestion);
  const [gameReport, setGameReport] = useRecoilState(CurrentGameReport);

  useEffect(() => {
    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = async (data) => {
      if (!location.pathname.includes('/game')) {
        //console.log('Reception du lobbyState', data);
        setLobbyState(data);
        if (!location.pathname.includes('/lobby')) {
          naviguate(`/lobby/${data.lobbyId}`);
        }
      }
    };

    const onGameState: Listener<ServerPayloads[ServerEvents.GameState]> = (data) => {
      console.log('Reception du gameState', data);
      setGameState(data);
    };

    const onLobbyJoined: Listener<ServerPayloads[ServerEvents.LobbyJoined]> = (data) => {
      console.log('Reception du lobbyJoined', data);
      localStorage.setItem('clientInGameId', data.clientInGameId);
    };

    const onGameStart: Listener<ServerPayloads[ServerEvents.GameStart]> = (data) => {
      console.log('Reception du gameStart', data);
      setGameState(data.gameState);
      setSensibilisationQuestion(data.sensibilisationQuestion);
      naviguate('/game/');
    };

    const onPracticeQuestion: Listener<ServerPayloads[ServerEvents.PracticeQuestion]> = (data) => {
      console.log('Reception de la question de pratique', data);
      setPracticeQuestion(data);
    }

    const onGetSensibilisationQuestion: Listener<ServerPayloads[ServerEvents.SensibilisationQuestion]> = (data) => {
      console.log('Reception de la question de sensibilisation', data);
      setSensibilisationQuestion(data);
    };

    const onSensibilisationAnswered: Listener<ServerPayloads[ServerEvents.SensibilisationAnswered]> = () => {
      console.log('Reception SensibilisationAnswered');
      setTimeout(() => {
        setSensibilisationQuestion(null);
      }, 2000);
    }

    const onPlayerPast: Listener<ServerPayloads[ServerEvents.PlayerPassed]> = (data) => {
      notifications.show({
        title: 'Player passed turn',
        message: `${data.playerName} passed his turn because he has not yet answered correctly to the sensibilisation question`,
        color: 'orange',
      })
    }

    const onPracticeAnswered: Listener<ServerPayloads[ServerEvents.PracticeAnswered]> = () => {
      console.log('Reception PracticeAnswered');
      setPracticeQuestion(null);
    }

    const onGameReport: Listener<ServerPayloads[ServerEvents.GameReport]> = (data) => {
      console.log('Reception  GameReport', data);
      setGameReport(data);
      naviguate('/game/report/');
    }


    if (!socket.connected) {
      sm.connect();
    }
    if (!sm.socket.hasListeners(ServerEvents.LobbyState)) sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    if (!sm.socket.hasListeners(ServerEvents.LobbyJoined)) sm.registerListener(ServerEvents.LobbyJoined, onLobbyJoined);
    if (!sm.socket.hasListeners(ServerEvents.GameState)) sm.registerListener(ServerEvents.GameState, onGameState);
    if (!sm.socket.hasListeners(ServerEvents.GameStart)) sm.registerListener(ServerEvents.GameStart, onGameStart);
    if (!sm.socket.hasListeners(ServerEvents.PracticeQuestion)) sm.registerListener(ServerEvents.PracticeQuestion, onPracticeQuestion);
    if (!sm.socket.hasListeners(ServerEvents.PracticeAnswered)) sm.registerListener(ServerEvents.PracticeAnswered, onPracticeAnswered);
    if (!sm.socket.hasListeners(ServerEvents.SensibilisationQuestion)) sm.registerListener(ServerEvents.SensibilisationQuestion, onGetSensibilisationQuestion);
    if (!sm.socket.hasListeners(ServerEvents.SensibilisationAnswered)) sm.registerListener(ServerEvents.SensibilisationAnswered, onSensibilisationAnswered);
    if (!sm.socket.hasListeners(ServerEvents.PlayerPassed)) sm.registerListener(ServerEvents.PlayerPassed, onPlayerPast);
    if (!sm.socket.hasListeners(ServerEvents.GameReport)) sm.registerListener(ServerEvents.GameReport, onGameReport);

    return () => {
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.LobbyJoined, onLobbyJoined);
      sm.removeListener(ServerEvents.GameState, onGameState);
      sm.removeListener(ServerEvents.GameStart, onGameStart);
      sm.removeListener(ServerEvents.PracticeQuestion, onPracticeQuestion);
      sm.removeListener(ServerEvents.SensibilisationQuestion, onGetSensibilisationQuestion);
      sm.removeListener(ServerEvents.SensibilisationAnswered, onSensibilisationAnswered);
      sm.removeListener(ServerEvents.PlayerPassed, onPlayerPast);
      sm.removeListener(ServerEvents.PracticeAnswered, onPracticeAnswered);
      sm.removeListener(ServerEvents.GameReport, onGameReport);
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
