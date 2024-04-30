import React, { useState } from 'react';
import styles from './LobbyComponent.module.css';

const LobbyComponent: React.FC = () => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCodeClick = () => {
        setIsCopied(true);
        // Logic to copy the code can be added here
        navigator.clipboard.writeText('77674');
        // You can set a timeout to reset the isCopied state after a certain time
        setTimeout(() => setIsCopied(false), 2000); // Reset isCopied after 2000 milliseconds (2 seconds)
    };

    return (
        <>
            <div className={styles.codeContainer}>
                <label className={`${styles.code} ${isCopied ? styles.copied : ''}`} onClick={handleCodeClick}>
                    Code : 77674
                    <span className={styles.tooltip}>{isCopied ? '' : ''}</span>
                </label>
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

export default LobbyComponent;
