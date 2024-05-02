import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyEndGameSummary.module.css';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import next from '@app/icons/next.webp';

const MyEndGameSummary: React.FC = () => {
    const data = [
        { type: 'BestPractice', id: '32', title: 'Carte 1', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
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

    const [isVisible, setIsVisible] = useState(true);
    const [startBPIndex, setStartBPIndex] = useState(0); // Index de départ des bonnes pratiques
    const [startMPIndex, setStartMPIndex] = useState(0); // Index de départ des mauvaises pratiques
    const navigate = useNavigate();

    if (!isVisible) {
        return null;
    }

    const nextBP = () => {
        if (startBPIndex + 3 < data.filter(card => card.type === 'BestPractice').length) {
            setStartBPIndex(startBPIndex + 1);
        }
    };

    const prevBP = () => {
        if (startBPIndex > 0) {
            setStartBPIndex(startBPIndex - 1);
        }
    };

    const nextMP = () => {
        if (startMPIndex + 3 < data.filter(card => card.type === 'BadPractice').length) {
            setStartMPIndex(startMPIndex + 1);
        }
    };

    const prevMP = () => {
        if (startMPIndex > 0) {
            setStartMPIndex(startMPIndex - 1);
        }
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>Mes bonnes pratiques applicables</label><br />
            <div className={styles.cardContainer}>
                {data.filter(card => card.type === 'BestPractice').slice(startBPIndex, startBPIndex + 3).map((card, index) => (
                    <div key={`BP${index}`} className={styles.card}>
                        <BestPracticeCard
                            cardType={card.type}
                            id={card.id}
                            title={card.title}
                            contents={card.contents}
                            carbon_loss={card.carbon_loss}
                        />
                        <span className={styles.cardNumber}>{index + startBPIndex + 1}</span>
                    </div>
                ))}
            </div>
            <div className={styles.navigationButtons}>
                {startBPIndex > 0 && <img src={next} alt="Previous" className={styles.prevButton} onClick={prevBP} />}
                {startBPIndex + 3 < data.filter(card => card.type === 'BestPractice').length && <img src={next} alt="Next" className={styles.nextButton} onClick={nextBP} />}
            </div>
            <hr className={styles.separator} />
            <label className={styles.label}>Mes mauvaises pratiques à bannir</label><br />
            <div className={styles.cardContainer}>
                {data.filter(card => card.type === 'BadPractice').slice(startMPIndex, startMPIndex + 3).map((card, index) => (
                    <div key={`MP${index}`} className={styles.card}>
                        <BadPracticeCard
                            cardType={card.type}
                            id={card.id}
                            title={card.title}
                            contents={card.contents}
                            targetedPlayer={card.targetedPlayer}
                        />
                        <span className={styles.cardNumber}>{index + startMPIndex + 1}</span>
                    </div>
                ))}
            </div>
            <div className={styles.navigationButtons}>
                {startMPIndex > 0 && <img src={next} alt="Previous" className={styles.prevButton} onClick={prevMP} />}
                {startMPIndex + 3 < data.filter(card => card.type === 'BestPractice').length && <img src={next} alt="Next" className={styles.nextButton} onClick={nextMP} />}
            </div>
        </div>
    );
};

export default MyEndGameSummary;
