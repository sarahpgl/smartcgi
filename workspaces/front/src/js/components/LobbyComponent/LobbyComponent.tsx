import React, { useState } from 'react';
import styles from './LobbyComponent.module.css';
import { useRecoilState } from 'recoil';
import { CurrentLobbyState } from '../Game/states';

const LobbyComponent: React.FC = () => {
    const [isCopied, setIsCopied] = useState(false);
    const [lobbyState] = useRecoilState(CurrentLobbyState);

    const handleCodeClick = () => {
        setIsCopied(true);
        // Logic to copy the code can be added here
        navigator.clipboard.writeText(lobbyState?.connectionCode || '');
        // You can set a timeout to reset the isCopied state after a certain time
        setTimeout(() => setIsCopied(false), 2000); // Reset isCopied after 2000 milliseconds (2 seconds)
    };

    return (
        <>
            <div className={styles.codeContainer}>
                <label className={`${styles.code} ${isCopied ? styles.copied : ''}`} onClick={handleCodeClick}>
                    Code : {lobbyState?.connectionCode}
                    <span className={styles.tooltip}>{isCopied ? '' : ''}</span>
                </label>
            </div>
            <div className={styles.container}>
                <label className={styles.label}>Participants : {lobbyState?.clientsNames.length}/4</label> <br />
                <label className={styles.participant}>{lobbyState?.ownerName} (Hôte)</label> <br />
                {lobbyState?.clientsNames.map((name, index) => {
                    if (name === lobbyState?.ownerName) {
                        return null;
                    }
                    return (
                        <label key={index} className={styles.participant}>{name}</label>
                    )
                })}
                <button className={styles.button}>Lancer la partie</button> <br />
            </div>
        </>
    );
};

export default LobbyComponent;
