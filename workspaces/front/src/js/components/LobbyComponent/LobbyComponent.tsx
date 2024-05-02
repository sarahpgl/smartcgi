import React, { useState } from 'react';
import styles from './LobbyComponent.module.css';
import { useRecoilState } from 'recoil';
import { CurrentLobbyState } from '../Game/states';
import useSocketManager from '@hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';


const LobbyComponent: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [lobbyState] = useRecoilState(CurrentLobbyState);
  const { sm } = useSocketManager();

  const handleCodeClick = () => {
    setIsCopied(true);
    // Logic to copy the code can be added here
    navigator.clipboard.writeText(lobbyState?.connectionCode || '');
    // You can set a timeout to reset the isCopied state after a certain time
    setTimeout(() => setIsCopied(false), 2000); // Reset isCopied after 2000 milliseconds (2 seconds)
  };

  const handleStartGame = () => {
    if ((lobbyState ? Object.keys(lobbyState?.clientsNames).length  : 0 )=== 2){
      sm.emit({
        event: ClientEvents.LobbyStartGame,
        data: {
          clientInGameId: localStorage.getItem('clientInGameId') ?? ''
        }
      })
    } else {
      alert("Il n'y a pas assez de joueurs pour lancer la partie")
    }
  }

  return (
    <>
      <div className={styles.codeContainer}>
        <label className={`${styles.code} ${isCopied ? styles.copied : ''}`} onClick={handleCodeClick}>
          Code : {lobbyState?.connectionCode}
          <span className={styles.tooltip}>{isCopied ? '' : ''}</span>
        </label>
      </div>
      <div className={styles.container}>
        <label className={styles.label}>Participants : {lobbyState ? Object.keys(lobbyState?.clientsNames).length : 0}/4</label> <br />
        <label className={styles.participant}>{lobbyState?.clientsNames[lobbyState.ownerId]} (Hôte)</label> <br />
        {(lobbyState ? Object.keys(lobbyState?.clientsNames) : []).map((id, index) => {
          if (id === lobbyState?.ownerId) {
            return null;
          }
          return (
            <label key={index} className={styles.participant}>{lobbyState?.clientsNames[id]}</label>
          )
        })}
        {lobbyState?.ownerId === localStorage.getItem('clientInGameId') && (
          <button className={styles.button} onClick={handleStartGame}>Lancer la partie</button>
        )}

      </div>
    </>
  );
};

export default LobbyComponent;
