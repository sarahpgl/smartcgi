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
import { Difficulty } from '@shared/common/Cards';

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

    useEffect(() => {
        console.log('gameState dans game', gameState);
    });

    let pos = 0;
    let positions = ['Right', 'Left', 'Top'];


    //données factices pour le débug
    let playerstate1={
        co2Saved: 500,
        sensibilisationPoints: 3,
        expertCards: [],
        badPractice: "Developer",
        playerName: "Goat",
        cardsInHand: [
            { cardType: 'BadPractice',actor :'ProductOwner', id: '32',difficulty:Difficulty.FOUR, title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
            { cardType: 'BestPractice', id: '32', title: 'VIDE', difficulty:Difficulty.ONE,  contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla blabla blabla blablablabla blabla blabla blabla', carbon_loss: 150 },
            { cardType: 'Expert', id: '32', actor: 'ProductOwner', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
            { cardType: 'Formation', id: '32', actor: 'ProductOwner', title: 'VIDE', contents: 'blablabla blabal blabal blablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablablablablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablablablablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablablablablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablablablablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablablablablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablablablablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablablablablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablablablablablabla blabla blabla blabla blablablabla blabla blabla blabla blablablabla' },
            { cardType: 'BadPractice', id: '32', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' , difficulty: Difficulty.TWO},
            { cardType: 'BestPractice',id: '32',title: 'VIDEeeee',contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ',carbon_loss: 150,difficulty: Difficulty.TWO,actor: 'Architect', network_gain: true,memory_gain: false,cpu_gain: true,storage_gain: false},               
            { cardType: 'Expert', id: '32', actor: 'ProductOwner', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
        ],
        practiceAnswers: [],
        playerId: '23',
        canPlay: false,
        cardsHistory: []
    };

    let playerstate2={
        co2Saved: 600,
        sensibilisationPoints: 3,
        expertCards: ["Developer", "ProductOwner"],
        badPractice: "",
        playerName: "Jean blablablabla  blabla bla",
        cardsInHand: [],
        practiceAnswers: [],
        playerId: '12',
        canPlay: false,
        cardsHistory: []
    };

    let playerstate3={
        co2Saved: 700,
        sensibilisationPoints: 3,
        expertCards: ["Developer"],
        badPractice: "",
        playerName: "Pierre",
        cardsInHand: [],
        practiceAnswers: [],
        playerId: '45',
        canPlay: false,
        cardsHistory: []
    };

    let playerstate4={
        co2Saved: 800,
        sensibilisationPoints: 3,
        expertCards: ["ProductOwner"],
        badPractice: "",
        playerName: "Paul",
        cardsInHand: [],
        practiceAnswers: [],
        playerId: '78',
        canPlay: false,
        cardsHistory: []
    };

    let turn='Me';
    // fin données factices pour le débug
        

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
                                        <PlayerBoard MPSelected={handleMPSelected} noMPSelected={handleNoMPSelected} playerState={playerState} myTurn={turn === 'Me'} />
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
                        console.log('playerSate', playerState.co2Saved);
                        pos = (pos + 1) % 3;
                        return (
                            <div key={playerId} className={`${positionClass} ${MP === 1 ? (playerAbleToMP.includes(positions[pos]) ? styles.opponentBoardOk : styles.opponentBoardMPImpossible) : positionClass}`}>
                                <div onClick={() => handleMPPersonSelected(playerState.position)}>
                                    <OpponentBoard playerState={playerState} myTurn={turn === playerState.position} />
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}

                
                
                {/*A supprimer c'est juste pour mon débug (greg le 4/5 à 18h)*/}

                <div className={styles.playerBoard}>
                    <PlayerBoard MPSelected={handleMPSelected} noMPSelected={handleNoMPSelected} playerState={playerstate1} myTurn={turn === 'Me'} />
                </div>

                <div className={`${styles.opponentBoardLeft} ${MP === 1 ? (playerAbleToMP.includes("Left") ? styles.opponentBoardOk : styles.opponentBoardMPImpossible) : styles.opponentBoardLeft}`}>
                    <div onClick={() => handleMPPersonSelected('Left')}>
                        <OpponentBoard playerState={playerstate2} myTurn={turn === 'Left'} />
                    </div>
                </div>


                <div className={`${styles.opponentBoardRight} ${MP === 1 ? (playerAbleToMP.includes("Right") ? styles.opponentBoardOk : styles.opponentBoardMPImpossible) : styles.opponentBoardRight}`}>
                    <div onClick={() => handleMPPersonSelected('Right')}>
                        <OpponentBoard playerState={playerstate3} myTurn={turn === 'Right'} />
                    </div>
                </div>

                <div className={`${styles.opponentBoardTop} ${MP === 1 ? (playerAbleToMP.includes("Top") ? styles.opponentBoardOk : styles.opponentBoardMPImpossible) : styles.opponentBoardTop}`}>
                    <div onClick={() => handleMPPersonSelected('Top')}>
                        <OpponentBoard playerState={playerstate4} myTurn={turn === 'Top'} />
                    </div>
                </div>
                {/*/////A supprimer c'est juste pour mon débug (greg le 4/5 à 18h)*/}


                <div className={styles.deck}>
                    <CardDeck />
                </div>
            </div>
            <GameManager />
        </div>
    );

}

export default GamePage;
