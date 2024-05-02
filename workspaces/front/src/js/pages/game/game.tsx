import React, { useState } from 'react';
import Header from "@app/js/components/header/Header";
import PlayerBoard from '@app/js/components/PlayerBoard/PlayerBoard';

import styles from './game.module.css';
import OpponentBoard from '@app/js/components/OpponentBoard/OpponentBoard';
import CardDeck from '@app/js/components/CardDeck/CardDeck';

function GamePage() {
    let playerAbleToMP = ["Top"];

    const [MP, setMP] = useState(0);

    const handleMPSelected = () => {
        setMP(1);
        console.log("MPSelected");
    };

    const handleNoMPSelected = () => {
        setMP(0);
        console.log("noMPSelected");
    }

    const handleMPPersonSelected = (person: string) => {
        if (MP === 1) {

            if (playerAbleToMP.includes(person)) {
                window.alert("MPSelected for " + person);
                setMP(0);
            } else {
                window.alert("MPSelected not allowed for " + person);

            }
        }
    }

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.playerBoard}>
                    <PlayerBoard MPSelected={handleMPSelected} noMPSelected={handleNoMPSelected} />
                </div>
                <div className={`${styles.opponentBoardLeft} ${MP === 1 ? (playerAbleToMP.includes("Left") ? styles.opponentBoardOk : styles.opponentBoardMPImpossible) : styles.opponentBoardLeft}`}>
                    <div onClick={() => handleMPPersonSelected("Left")}>
                        <OpponentBoard />
                    </div>
                </div>
                <div className={`${styles.opponentBoardRight} ${MP === 1 ? (playerAbleToMP.includes("Right") ? styles.opponentBoardOk : styles.opponentBoardMPImpossible) : styles.opponentBoardRight}`}>
                    <div onClick={() => handleMPPersonSelected("Right")}>
                        <OpponentBoard />
                    </div>
                </div>
                <div className={`${styles.opponentBoardTop} ${MP === 1 ? (playerAbleToMP.includes("Top") ? styles.opponentBoardOk : styles.opponentBoardMPImpossible) : styles.opponentBoardTop}`}>
                    <div onClick={() => handleMPPersonSelected("Top")}>
                        <OpponentBoard />
                    </div>
                </div>
                <div className={styles.deck}>
                    <CardDeck />
                </div>
            </div>
        </div>
    );
    
}

export default GamePage;
