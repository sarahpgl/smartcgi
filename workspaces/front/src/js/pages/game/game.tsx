import React from 'react';
import Header from "@app/js/components/header/Header";
import PlayerBoard from '@app/js/components/PlayerBoard/PlayerBoard';

import styles from './game.module.css';
import OpponentBoard from '@app/js/components/OpponentBoard/OpponentBoard';

function gamePage() {
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <div className={styles.playerBoard}>
                    <PlayerBoard />
                </div>
                <div className={styles.opponentBoardLeft}>
                    <OpponentBoard />
                </div>
                <div className={styles.opponentBoardRight}>
                    <OpponentBoard />
                </div>
                <div className={styles.opponentBoardTop}>
                    <OpponentBoard />
                </div>
            </div>
        </div>
    );
}

export default gamePage;