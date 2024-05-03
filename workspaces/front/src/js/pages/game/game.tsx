import React, { useState } from 'react';
import Header from "@app/js/components/header/Header";
import PlayerBoard from '@app/js/components/PlayerBoard/PlayerBoard';

import styles from './game.module.css';
import OpponentBoard from '@app/js/components/OpponentBoard/OpponentBoard';
import CardDeck from '@app/js/components/CardDeck/CardDeck';
import GameManager from '@app/js/components/Game/GameManager';
import QuestionnaireBP from '@app/js/components/QuestionnaireBP/QuestionnaireBP';
import QuestionnaireMP from '@app/js/components/QuestionnaireMP/QuestionnaireMP';
import SensibilisationQuizz from '@app/js/components/SensibilisationQuizz/SensibilisationQuizz';
import { useRecoilState } from 'recoil';
import { CurrentGameState } from '@app/js/components/Game/states';
import useSocketManager from '@hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';

function GamePage() {
    const [gameState] = useRecoilState(CurrentGameState);
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

    let pos = 0;
    let positions = ['Right', 'Left', 'Top'];

    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.container}>
                {gameState ? (
                    Object.keys(gameState.playerStates).map((playerId) => {
                        const playerState = gameState.playerStates[playerId];
                        if (playerState.clientInGameId === localStorage.getItem('clientInGameId')) {
                            return (
                                <>
                                    <div className={styles.playerBoard} key={playerId}>
                                        <PlayerBoard MPSelected={handleMPSelected} noMPSelected={handleNoMPSelected} playerState={playerState} />
                                    </div>

                                </>

                            );
                        }
                        return null;
                    })
                ) : (
                    <></>
                )}

                {gameState && Object.keys(gameState.playerStates).map((playerId) => {
                    const playerState = gameState.playerStates[playerId];
                    if (playerState.clientInGameId !== localStorage.getItem('clientInGameId')) {
                        let positionClass = '';
                        if (pos === 0) {
                            positionClass = styles.opponentBoardRight;
                        } else if (pos === 1) {
                            positionClass = styles.opponentBoardLeft;
                        } else if (pos === 2) {
                            positionClass = styles.opponentBoardTop;
                        }
                        console.log('playerSate',playerState.co2Saved);
                        pos = (pos + 1) % 3;
                        return (
                            <div key={playerId} className={`${positionClass} ${MP === 1 ? (playerAbleToMP.includes(positions[pos]) ? styles.opponentBoardOk : styles.opponentBoardMPImpossible) : positionClass}`}>
                                <div onClick={() => handleMPPersonSelected(playerState.position)}>
                                    <OpponentBoard playerState={playerState} />
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}

                <div className={styles.deck}>
                    <CardDeck />
                </div>
            </div>
            <GameManager />
        </div>
    );

}

export default GamePage;
