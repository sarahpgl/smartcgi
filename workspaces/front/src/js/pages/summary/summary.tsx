import React, { useEffect, useState } from 'react';
import Header from "@app/js/components/header/Header";
import EndGameSummary from '@app/js/components/EndGameSummary/EndGameSummary';
import MyEndGameSummary from '@app/js/components/MyEndGameSummary/MyEndGameSummary';
import { useRecoilState } from 'recoil';
import { CurrentGameReport } from '@app/js/components/Game/states';
import styles from './summary.module.css';


function SummaryPage() {
    const [gameReport, setGameReport] = useRecoilState(CurrentGameReport);
    const [showMessage, setShowMessage] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const cards = [

        { type: 'BestPractice', id: '32', title: 'Carte 1', contents: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCblabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 3', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 4', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 5', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 6', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 25 },
        { type: 'BestPractice', id: '32', title: 'Carte 7', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 100 },
        { type: 'BadPractice', id: '32', title: 'Carte 1', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'BadPractice', id: '32', title: 'Carte 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'BadPractice', id: '32', title: 'Carte 3', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'BadPractice', id: '32', title: 'Carte 3', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' }
    ];

    const cards2 = [

        { type: 'BestPractice', id: '32', title: 'Carte 1', contents: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCblabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 3', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BadPractice', id: '32', title: 'Carte 1', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'BadPractice', id: '32', title: 'Carte 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'BadPractice', id: '32', title: 'Carte 3', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
    ];

    let classement=[{name:"gregouz",score:100},{name:"lou",score:50},{name:"glantrel",score:25}];


    return (
        <>
            <Header />
            <label className={styles.label}>Vainqueur</label>
            <label className={styles.label1}>{classement[0].name}</label>

            {gameReport ? (
                <div className={styles.container}>
                    <EndGameSummary cards={gameReport.mostPopularCards} />
                    <MyEndGameSummary cards={gameReport.myArchivedCards} />
                </div>
            ) : (
                <div className={styles.container}>
                    <EndGameSummary cards={cards2} />
                    <MyEndGameSummary cards={cards} />
                </div>
            )}
        </>
    )
}

export default SummaryPage;