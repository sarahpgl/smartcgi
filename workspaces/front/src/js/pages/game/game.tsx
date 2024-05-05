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
import { CurrentSensibilisationQuestion, CurrentPracticeQuestion, CurrentGameState } from '@app/js/components/Game/states';
import useSocketManager from '@hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { PlayerStateInterface } from '@shared/common/Game';
import { Bad_Practice_Card } from '@shared/common/Cards';
import { Difficulty } from '@shared/common/Cards';
import PracticeQuestion from '@app/js/components/PracticeQuestion/PracticeQuestion';

function GamePage() {

  const [gameState] = useRecoilState(CurrentGameState);
  const [sensibilisationQuestion] = useRecoilState(CurrentSensibilisationQuestion);
  const [practiceQuestion] = useRecoilState(CurrentPracticeQuestion);
  const { sm } = useSocketManager();
  const playerAbleToMP = ["Top"];

  const [MP, setMP] = useState<Bad_Practice_Card | null>(null);
  const [showQuizz, setShowQuizz] = useState(true);

  const handleMPSelected = (card: Bad_Practice_Card) => {
    setMP(card);
    console.log("MPSelected : ", MP);
  };

  const handleNoMPSelected = () => {
    setMP(null);
    console.log("noMPSelected");
  }

  const handleMPPersonSelected = (playerState: PlayerStateInterface) => {
    if (MP !== null) {

      if (playerState.badPractice === null && !(playerState.expertCards.includes(MP.actor))) {
        //window.alert("MPSelected for " + playerState.playerName);
        console.log("La mauvaise pratique est", MP);
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
    //console.log('gameState dans game', gameState);
  });

  let pos = 0;
  const positions = ['Right', 'Left', 'Top'];

  return (
    <div className={styles.page}>
      <Header />
      {sensibilisationQuestion ? (
        <div className={styles.quizzSensibilisation}><SensibilisationQuizz/></div>
      ) : (
        <>
        </>
      )}
      {practiceQuestion ? (
        <div className={styles.quizzPractice}><PracticeQuestion card={practiceQuestion.card} /></div>
      ) : (
        <>
        </>
      )}
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
            //console.log('playerSate', playerState.co2Saved);
            pos = (pos + 1) % 3;
            return (
              <div key={index} className={`${positionClass} ${MP !== null ? ((playerState.badPractice === null &&!(playerState.expertCards.includes(MP.actor) ))? styles.opponentBoardOk : styles.opponentBoardMPImpossible) : positionClass}`}>
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
