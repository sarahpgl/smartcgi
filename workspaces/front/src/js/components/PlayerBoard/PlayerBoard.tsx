import React, { useState } from 'react';

import styles from './PlayerBoard.module.css';

import { PublicPlayerState } from '@shared/common/Game';

import PlayerHand from '../PlayerHand/PlayerHand';
import PlayerStatus from '../PlayerStatus/PlayerStatus';
import PlayerInGameHistory from '../PlayerInGameHistory/PlayerInGameHistory';

function PlayerBoard() {

    let player: PublicPlayerState = {
        co2Saved: 900,
        sensibilisationPoints: 3,
        expertCards: ["Developer", "Architect"],
        badPractice: "Developer",
        playerName: "Jean",
        cardsInHand: [],
        practiceAnswers: [],
        playerId: '',
        canPlay: false,
        cardsHistory: []
    };



    return (
        <div className={styles.board}>
            <div className={styles.status}>
                <PlayerStatus playerstate={player} me={1} /> 
            </div>
            <div className={styles.hand}>
                <PlayerHand />
            </div>
            <div className={styles.history}>
                <PlayerInGameHistory />
            </div>
        </div>
    );
}

export default PlayerBoard;
