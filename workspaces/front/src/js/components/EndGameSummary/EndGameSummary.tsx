import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EndGameSummary.module.css';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import { Card } from '@shared/common/Cards';

const EndGameSummary: React.FC <{cards : Card[]}> = ({ cards }) =>  {
    const data = cards;

    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();
    const [selectedCard, setSelectedCard] = useState(null);


    if (!isVisible) {
        return null;
    }

    const handleCardClick = (card) => {
        setSelectedCard(card);
    };
    
    const handleCloseCard = () => {
        setSelectedCard(null);
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>Top 3 des bonnes pratiques à appliquer</label><br />
            <label className={styles.label2}>(selon les votes des joueurs)</label><br />
            <div className={styles.cardContainer}>
                
            {data.filter(card => card.type === 'BestPractice').map((card, index) => (
                <div key={`BP${index}`} className={styles.card} onClick={() => handleCardClick(card)}>
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
            <label className={styles.label}>Top 3 des mauvaises pratiques à bannir</label><br />
            <label className={styles.label2}>(selon les votes des joueurs)</label><br />
            <div className={styles.cardContainer}>
                {data.filter(card => card.type === 'BadPractice').map((card, index) => (
                    <div key={`BP${index}`} className={styles.card} onClick={() => handleCardClick(card)}>
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

            {selectedCard && (
            <div className={styles.modalBackdrop} onClick={handleCloseCard}>
                <div className={`${styles.modalContent} ${styles.bigCard}`}>
                    {selectedCard.type === 'BestPractice' ? (
                        <BestPracticeCard
                            cardType={selectedCard.type}
                            id={selectedCard.id}
                            title={selectedCard.title}
                            contents={selectedCard.contents}
                            carbon_loss={selectedCard.carbon_loss}
                        />
                    ) : (
                        <BadPracticeCard
                            cardType={selectedCard.type}
                            id={selectedCard.id}
                            title={selectedCard.title}
                            contents={selectedCard.contents}
                            targetedPlayer={selectedCard.targetedPlayer}
                        />
                    )}
                </div>
            </div>
)}

        </div>
    );
};

export default EndGameSummary;
