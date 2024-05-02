import React, { useState } from 'react';
import styles from './PlayerHand.module.css';

import BestPracticeCard from '../BestPracticeCard/BestPracticeCard';
import ExpertCard from '../ExpertCard/ExpertCard';
import BadPracticeCard from '../BadPracticeCard/BadPracticeCard';
import FormationCard from '../FormationCard/FormationCard';

import iconOk from '../../../icons/ok_icon.webp';
import iconBin from '../../../icons/bin_icon.webp';

import { Best_Practice_Card, Bad_Practice_Card, Expert_Card, Formation_Card } from '@shared/common/Cards';

function PlayerHand({MPSelected , noMPSelected}) {
    const [selectedCard, setSelectedCard] = useState<number | null>(null);

    const handleCardClick = (cardId: number,cardType:string) => {
        if (selectedCard === cardId) {
            setSelectedCard(null);
            noMPSelected();
            return;
        }
        noMPSelected();
        setSelectedCard(cardId);
        if (cardType === "BadPractice") {
            MPSelected();
        }
    };

    const handleCardHover = (cardId: number) => {
    };

    const handleCardLeave = (cardType:string) => {
        setSelectedCard(null);
    };

    // Définissez vos cartes dans un tableau
    const cards = [
        { type: 'BestPractice', id: '32', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 },
        { type: 'BadPractice', id: '32', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'Expert', id: '32', actor: 'ProductOwner', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
        { type: 'Formation', id: '32', actor: 'ProductOwner', title: 'titre de la carte', contents: 'blablabla blabal blabal' },
        { type: 'Expert', id: '32', actor: 'ProductOwner', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
        { type: 'BadPractice', id: '32', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { type: 'BestPractice', id: '32', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50 }
    ];

    return (
        <div className={styles.hand}>
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`${styles.card} ${selectedCard === index ? styles.selected : ''}`}
                    onClick={() => handleCardClick(index,card.type)}
                    onMouseEnter={() => handleCardHover(index)}
                    onMouseLeave={() => handleCardLeave(card.type)}
                >
                    {card.type === 'BestPractice' && (
                        <BestPracticeCard cardType={card.type} id={card.id} title={card.title} contents={card.contents} carbon_loss={card.carbon_loss} />
                    )}
                    {card.type === 'BadPractice' && (
                        <BadPracticeCard cardType={card.type} id={card.id} title={card.title} contents={card.contents} targetedPlayer={card.targetedPlayer} />
                    )}
                    {card.type === 'Expert' && (
                        <ExpertCard cardType={card.type} id={card.id} actor={card.actor} title={card.title} contents={card.contents} />
                    )}
                    {card.type === 'Formation' && (
                        <FormationCard cardType={card.type} id={card.id} actor={card.actor} title={card.title} contents={card.contents} />
                    )}
                    {(card.type !== "BadPractice") && selectedCard === index && 
                        <div className={styles.tooltip}>
                            <img className={styles.iconOk} src={iconOk} alt="iconOk" />
                            <span className={styles.tooltiptext}>Valider</span>
                        </div>
                    }
                    {selectedCard === index && (
                        <div className={styles.tooltip}>
                            <img className={styles.iconBin} src={iconBin} alt="iconBin" />
                            <span className={styles.tooltiptext}>Défausser la carte</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default PlayerHand;
