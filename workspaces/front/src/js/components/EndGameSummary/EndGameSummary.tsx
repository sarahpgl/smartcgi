import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EndGameSummary.module.css';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";

const EndGameSummary: React.FC = () => {
    const data = [
        { type: 'BestPractice', id: '32', title: 'Carte 1', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BestPractice', id: '32', title: 'Carte 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 25 },
        { type: 'BestPractice', id: '32', title: 'Carte 3', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 100 },
        { type: 'BadPractice', id: '32', title: 'Carte 1', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'BadPractice', id: '32', title: 'Carte 2', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'BadPractice', id: '32', title: 'Carte 3', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
    ];

    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>Bonnes pratiques les plus applicables</label><br />
            <label className={styles.label2}>(selon les votes des joueurs)</label><br />
            <div className={styles.cardContainer}>
                
                {data.filter(card => card.type === 'BestPractice').map((card, index) => (
                    <div key={`BP${index}`} className={styles.card}>
                        <BestPracticeCard
                            cardType={card.type}
                            id={card.id}
                            title={card.title}
                            contents={card.contents}
                            carbon_loss={card.carbon_loss}
                        />
                        <span className={styles.cardNumber}>{index + 1}</span>
                    </div>
                ))}
            </div>
            <hr className={styles.separator} />
            <label className={styles.label}>Mauvaises pratiques les plus bannissables</label><br />
            <label className={styles.label2}>(selon les votes des joueurs)</label><br />
            <div className={styles.cardContainer}>
                {data.filter(card => card.type === 'BadPractice').map((card, index) => (
                    <div key={`MP${index}`} className={styles.card}>
                        <BadPracticeCard
                            cardType={card.type}
                            id={card.id}
                            title={card.title}
                            contents={card.contents}
                            targetedPlayer={card.targetedPlayer}
                        />
                        <span className={styles.cardNumber}>{index + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EndGameSummary;
