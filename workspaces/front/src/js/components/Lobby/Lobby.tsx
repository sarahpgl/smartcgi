import React from 'react';
import styles from './Lobby.module.css';

const Lobby: React.FC = () => {
    return (
        <>
            <div className={styles.codeContainer}>
                <label className={styles.code}>Code : 77674</label>
            </div>
            <div className={styles.container}>
                <label className={styles.label}>Participants : 3/4</label> <br />
                <label className={styles.participant}>Armand Demasson (Hôte)</label> <br />
                <label className={styles.participant}>Thierry LeBoss</label> <br />
                <label className={styles.participant}>Lou Delcourt</label> <br />
                <button className={styles.button}>Lancer la partie</button> <br />
            </div>
        </>
    );
};

export default Lobby;
