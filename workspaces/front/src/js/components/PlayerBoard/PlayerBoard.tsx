import React, { useState } from 'react';

import styles from './PlayerBoard.module.css';

import { PublicPlayerState } from '@shared/common/Game';

import PlayerHand from '../PlayerHand/PlayerHand';
import PlayerStatus from '../PlayerStatus/PlayerStatus';
import PlayerInGameHistory from '../PlayerInGameHistory/PlayerInGameHistory';

function PlayerBoard() {

    let name = "Pierre";
    let expert= ["ProductOwner", "Developer"];
    let bp = "Developer";
    let co2= 260;
    let sensibilisation = 2;



    return (
        <div className={styles.board}>
            <div className={styles.status}>
                <PlayerStatus playerstate="hi" me={1} /> 
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
