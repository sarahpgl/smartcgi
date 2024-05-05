/*import React, { useEffect, useState } from 'react';

import styles from './PlayerBoard.module.css';

import { PublicPlayerState } from '@shared/common/Game';

import PlayerHand from '../PlayerHand/PlayerHand';
import PlayerStatus from '../PlayerStatus/PlayerStatus';
import PlayerInGameHistory from '../PlayerInGameHistory/PlayerInGameHistory';
import { useRecoilState } from 'recoil';
import { CurrentGameState } from '../Game/states';
import useSocketManager from '@hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';


function PlayerBoard({ MPSelected, noMPSelected }) {
    const [gameState] = useRecoilState(CurrentGameState);

    useEffect(() => {
        console.log('gameState dans playerBoard ', gameState);
    });

    let player: PublicPlayerState = {
        co2Saved: 900,
        sensibilisationPoints: 0,
        expertCards: [],
        badPractice: "",
        playerName: "",
        cardsInHand: [],
        practiceAnswers: [],
        playerId: '',
        canPlay: false,
        cardsHistory: []
    };


    return (
        <div className={styles.board}>
            {gameState ? (
                Object.keys(gameState.playerStates).map((playerId) => {
                    const playerState = gameState.playerStates[playerId];
                    if (playerState.clientInGameId === localStorage.getItem('clientInGameId')) {
                        return (
                            <>
                                <div key={playerId} className={styles.status}>
                                    <PlayerStatus playerstate={playerState} me={1} />
                                </div>
                                <div className={styles.hand}>
                                    <PlayerHand MPSelected={MPSelected} noMPSelected={noMPSelected} Cards={playerState.cardsInHand} />
                                </div>
                                <div className={styles.history}>
                                    <PlayerInGameHistory Cards={playerState.cardsHistory} />
                                </div>

                            </>

                        );
                    }
                    return null;
                })
            ) : (
                <div className={styles.status}>
                    <PlayerStatus playerstate={player} me={1} />
                </div>
            )}

        </div>
    );
}

export default PlayerBoard;
*/

import React, { useEffect } from 'react';
import styles from './PlayerBoard.module.css';
import PlayerHand from '../PlayerHand/PlayerHand';
import PlayerStatus from '../PlayerStatus/PlayerStatus';
import PlayerInGameHistory from '../PlayerInGameHistory/PlayerInGameHistory';
import { useRecoilState } from 'recoil';
import { CurrentGameState } from '../Game/states';
import useSocketManager from '@hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';

function PlayerBoard({ MPSelected, noMPSelected, playerState ,myTurn}) {
    const [gameState] = useRecoilState(CurrentGameState);

    useEffect(() => {
        console.log('gameState dans playerBoard ', gameState);
    });

    return (
        <div className={styles.board}>
            {playerState && (
                <>
                    <div className={styles.status}>
                        <PlayerStatus playerstate={playerState} me={1} />
                    </div>
                    <div className={`${styles.hand} ${myTurn ? styles.handMyTurn : ''}`}>
                        <PlayerHand MPSelected={MPSelected} noMPSelected={noMPSelected} playerState={playerState} myTurn={myTurn} />
                    </div>
                    <div className={styles.history}>
                        <PlayerInGameHistory Cards={playerState.cardsHistory} />
                    </div>
                </>
            )}
        </div>
    );
}

export default PlayerBoard;


