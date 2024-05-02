import React, { useEffect, useState } from 'react';

import styles from './PlayerBoard.module.css';

import { PublicPlayerState } from '@shared/common/Game';

import PlayerHand from '../PlayerHand/PlayerHand';
import PlayerStatus from '../PlayerStatus/PlayerStatus';
import PlayerInGameHistory from '../PlayerInGameHistory/PlayerInGameHistory';
import { useRecoilState } from 'recoil';
import { CurrentGameState } from '../Game/states';
import useSocketManager from '@hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';

function PlayerBoard() {
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
                            <div key={playerId} className={styles.status}>
                                <PlayerStatus playerstate={playerState} me={1} />
                            </div>
                        );
                    }
                    return null;
                })
            ) : (
                <div className={styles.status}>
                    <PlayerStatus playerstate={player} me={1} />
                </div>
            )}
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

