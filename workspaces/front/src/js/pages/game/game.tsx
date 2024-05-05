import React, { useEffect, useState } from 'react';
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
import { PlayerStateInterface } from '@shared/common/Game';
import { Bad_Practice_Card } from '@shared/common/Cards';
import { Difficulty } from '@shared/common/Cards';

function GamePage() {

    const [gameState] = useRecoilState(CurrentGameState);
    const { sm } = useSocketManager();
    const playerAbleToMP = ["Top"];

    const [MP, setMP] = useState<Bad_Practice_Card | null>(null);

    const handleMPSelected = (card: Bad_Practice_Card) => {
        setMP(card);
        console.log("MPSelected");
    };

    const handleNoMPSelected = () => {
        setMP(null);
        console.log("noMPSelected");
    }

    const handleMPPersonSelected = (playerState: PlayerStateInterface) => {
        if (MP !== null) {

            if (playerState.badPractice === null) {
                window.alert("MPSelected for " + playerState.playerName);
                sm.emit({
                    event: ClientEvents.PlayCard,
                    data: {
                        card: {
                            ...MP,
                            targetedPlayerId: playerState.clientInGameId,
                        }
                    }
                })
                setMP(null);
            } else {
                window.alert(`MPSelected for ${playerState.playerName} but already has a bad practice`);

            }
        }
    }

    useEffect(() => {
        console.log('gameState dans game', gameState);
    });

    let turn = 'Me';

    let pos = 0;
    const positions = ['Right', 'Left', 'Top'];


    let playerState1: PlayerStateInterface = {
        clientInGameId: "300",
        playerName: "Player 1",
        co2Saved: 200,
        canPlay: true,
        sensibilisationPoints: 0,
        badPractice: 'Architect',
        expertCards: [],
        cardsHistory: [],
        cardsInHand: [
            { cardType: 'BadPractice', id: '1', title: 'Bad Practice 1', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', difficulty: Difficulty.ONE, network_gain: false, memory_gain: false, cpu_gain: false, storage_gain: false, actor: 'Architect' },
            { cardType: 'BestPractice', id: '2', title: 'Best Practice 1', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 150, network_gain: false, memory_gain: false, cpu_gain: false, storage_gain: false, difficulty: Difficulty.ONE, actor: 'Actor Name' },
            { cardType: 'Expert', id: '3', actor: 'ProductOwner', title: 'Expert 1', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
            { cardType: 'Formation', id: '4', actor: 'ProductOwner', title: 'Formation 1', contents: 'blablabla blabal blabal', linkToFormation: 'https://www.google.com' },
            { cardType: 'Expert', id: '5', actor: 'ProductOwner', title: 'Expert 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
            { cardType: 'BadPractice', id: '6', title: 'Bad Practice 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre', difficulty: Difficulty.ONE, network_gain: false, memory_gain: false, cpu_gain: false, storage_gain: false, actor: '' },
            { cardType: 'BestPractice', id: '7', title: 'Best Practice 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 180, network_gain: false, memory_gain: false, cpu_gain: false, storage_gain: false, difficulty: Difficulty.ONE, actor: 'Actor Name' }
        ],
        bestPracticeAnswers: [],
        badPracticeAnswers: [],
    };

    let playerState2: PlayerStateInterface = {
        clientInGameId: "301",
        playerName: "Player 2",
        co2Saved: 200,
        canPlay: true,
        sensibilisationPoints: 0,
        badPractice: null,
        expertCards: [],
        cardsHistory: [],
        cardsInHand: [],
        bestPracticeAnswers: [],
        badPracticeAnswers: [],
    };

    let playerState3: PlayerStateInterface = {
        clientInGameId: "302",
        playerName: "Player 3",
        co2Saved: 200,
        canPlay: true,
        sensibilisationPoints: 0,
        badPractice: null,
        expertCards: [],
        cardsHistory: [],
        cardsInHand: [],
        bestPracticeAnswers: [],
        badPracticeAnswers: [],
    };

    let playerState4: PlayerStateInterface = {
        clientInGameId: "303",
        playerName: "Player 4",
        co2Saved: 200,
        canPlay: true,
        sensibilisationPoints: 0,
        badPractice: null,
        expertCards: [],
        cardsHistory: [],
        cardsInHand: [],
        bestPracticeAnswers: [],
        badPracticeAnswers: [],
    };


    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.container}>
                {gameState ? (
                    gameState.playerStates.map((playerState, index) => {
                        if (playerState.clientInGameId === localStorage.getItem('clientInGameId')) {
                            return (
                                <>
                                    <div className={styles.playerBoard} key={index}>
                                        <PlayerBoard MPSelected={handleMPSelected} noMPSelected={handleNoMPSelected} playerState={playerState} myTurn={gameState.currentPlayerId === playerState.clientInGameId} />
                                    </div>

                                </>

                            );
                        }
                        return null;
                    })
                ) : (
                    <></>
                )}

                {gameState && gameState.playerStates.map((playerState, index) => {
                    if (playerState.clientInGameId !== localStorage.getItem('clientInGameId')) {
                        let positionClass = '';
                        if (pos === 0) {
                            positionClass = styles.opponentBoardRight;
                        } else if (pos === 1) {
                            positionClass = styles.opponentBoardLeft;
                        } else if (pos === 2) {
                            positionClass = styles.opponentBoardTop;
                        }
                        console.log('playerSate', playerState.co2Saved);
                        pos = (pos + 1) % 3;
                        return (
                            <div key={index} className={`${positionClass} ${MP !== null ? (playerState.badPractice === null ? styles.opponentBoardOk : styles.opponentBoardMPImpossible) : positionClass}`}>
                                <div onClick={() => handleMPPersonSelected(playerState)}>
                                    <OpponentBoard playerState={playerState} myTurn={gameState.currentPlayerId === playerState.clientInGameId} />
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
