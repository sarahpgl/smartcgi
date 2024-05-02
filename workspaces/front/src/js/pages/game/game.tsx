import React from 'react';
import Header from "@app/js/components/header/Header";
import PlayerBoard from '@app/js/components/PlayerBoard/PlayerBoard';

import styles from './game.module.css';
import OpponentBoard from '@app/js/components/OpponentBoard/OpponentBoard';
import QuestionnaireBP from '@app/js/components/QuestionnaireBP/QuestionnaireBP';
import QuestionnaireMP from '@app/js/components/QuestionnaireMP/QuestionnaireMP';
import SensibilisationQuizz from '@app/js/components/SensibilisationQuizz/SensibilisationQuizz';
import CardDeck from '@app/js/components/CardDeck/CardDeck';
import GameManager from '@app/js/components/Game/GameManager';

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
                <div className={styles.deck}>
                    <CardDeck />
                </div>
            </div>
            <GameManager />
        </div>
    );
}

export default gamePage;