import React, { useState } from 'react';
import styles from './PlayerHand.module.css';

import BestPracticeCard from '../BestPracticeCard/BestPracticeCard';
import ExpertCard from '../ExpertCard/ExpertCard';
import BadPracticeCard from '../BadPracticeCard/BadPracticeCard';
import FormationCard from '../FormationCard/FormationCard';

import iconOk from '../../../icons/ok_icon.webp';
import iconBin from '../../../icons/bin_icon.webp';

import { Best_Practice_Card, Bad_Practice_Card, Expert_Card, Formation_Card } from '@shared/common/Cards';

function PlayerHand() {
    const [selectedCard, setSelectedCard] = useState<number | null>(null);

    const handleCardClick = (cardId: number) => {
        if (selectedCard === cardId) {
            setSelectedCard(null);
            return;
        }
        setSelectedCard(cardId);
    };

    const handleCardHover = (cardId: number) => {
        
    };

    const handleCardLeave = () => {
        setSelectedCard(null);
    };

    let card1:Best_Practice_Card= {cardType: 'BestPractice', id: '32', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50};
    let card2:Bad_Practice_Card= {cardType: 'BadPractice', id: '32', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre'};
    let card3:Expert_Card= {cardType: 'Expert', id: '32', actor: 'ProductOwner', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla '};
    let card4:Formation_Card= {cardType: 'Formation', id: '32', actor: 'ProductOwner', title: 'titre de la carte', contents: 'blablabla blabal blabal'};
    let card5:Expert_Card= {cardType: 'Expert', id: '32', actor: 'ProductOwner', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla '};
    let card6:Bad_Practice_Card= {cardType: 'BadPractice', id: '32', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre'};
    let card7:Best_Practice_Card= {cardType: 'BestPractice', id: '32', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 50};

    return (
        <div className={styles.hand}>
            <div
                className={`${styles.card} ${selectedCard === 1 ? styles.selected : ''}`}
                onClick={() => handleCardClick(1)}
                onMouseEnter={() => handleCardHover(1)}
                onMouseLeave={handleCardLeave}>
                <BestPracticeCard cardType={card1.cardType} id={card1.id} title={card1.title} contents={card1.contents} carbon_loss={card1.carbon_loss} />
                {(card1.cardType !== "BadPractice") && selectedCard === 1 && 
                    <div className={styles.tooltip}>
                        <img className={styles.iconOk} src={iconOk} alt="iconOk" />
                        <span className={styles.tooltiptext}>Valider</span>
                    </div>
                }
                {selectedCard === 1 && (
                    <div className={styles.tooltip}>
                        <img className={styles.iconBin} src={iconBin} alt="iconBin" />
                        <span className={styles.tooltiptext}>Défausser la carte</span>
                    </div>
                )}         
            </div>
            <div
                className={`${styles.card} ${selectedCard === 2 ? styles.selected : ''}`}
                onClick={() => handleCardClick(2)}
                onMouseEnter={() => handleCardHover(2)}
                onMouseLeave={handleCardLeave}>
                <BadPracticeCard cardType={card2.cardType} id={card2.id} title={card2.title} contents={card2.contents} targetedPlayer={card2.targetedPlayer} />
                {(card2.cardType !== "BadPractice") && selectedCard === 2 && 
                    <div className={styles.tooltip}>
                        <img className={styles.iconOk} src={iconOk} alt="iconOk" />
                        <span className={styles.tooltiptext}>Valider</span>
                    </div>
                }
                {selectedCard === 2 && (
                    <div className={styles.tooltip}>
                        <img className={styles.iconBin} src={iconBin} alt="iconBin" />
                        <span className={styles.tooltiptext}>Défausser la carte</span>
                    </div>
                )}  
            </div>
            <div
                className={`${styles.card} ${selectedCard === 3 ? styles.selected : ''}`}
                onClick={() => handleCardClick(3)}
                onMouseEnter={() => handleCardHover(3)}
                onMouseLeave={handleCardLeave}>
                <ExpertCard cardType={card3.cardType} id={card3.id} actor={card3.actor} title={card3.title} contents={card3.contents} />
                {(card3.cardType !== "BadPractice") && selectedCard === 3 && 
                    <div className={styles.tooltip}>
                        <img className={styles.iconOk} src={iconOk} alt="iconOk" />
                        <span className={styles.tooltiptext}>Valider</span>
                    </div>
                }
                {selectedCard === 3 && (
                    <div className={styles.tooltip}>
                        <img className={styles.iconBin} src={iconBin} alt="iconBin" />
                        <span className={styles.tooltiptext}>Défausser la carte</span>
                    </div>
                )}   
            </div>
            <div
                className={`${styles.card} ${selectedCard === 4 ? styles.selected : ''}`}
                onClick={() => handleCardClick(4)}
                onMouseEnter={() => handleCardHover(4)}
                onMouseLeave={handleCardLeave}>
                <FormationCard cardType={card4.cardType} id={card4.id} actor={card4.actor} title={card4.title} contents={card4.contents} />
                {(card4.cardType !== "BadPractice") && selectedCard === 4 && 
                    <div className={styles.tooltip}>
                        <img className={styles.iconOk} src={iconOk} alt="iconOk" />
                        <span className={styles.tooltiptext}>Valider</span>
                    </div>
                }
                {selectedCard === 4 && (
                    <div className={styles.tooltip}>
                        <img className={styles.iconBin} src={iconBin} alt="iconBin" />
                        <span className={styles.tooltiptext}>Défausser la carte</span>
                    </div>
                )}   
            </div>
            <div
                className={`${styles.card} ${selectedCard === 5 ? styles.selected : ''}`}
                onClick={() => handleCardClick(5)}
                onMouseEnter={() => handleCardHover(5)}
                onMouseLeave={handleCardLeave}>
                <ExpertCard cardType={card5.cardType} id={card5.id} actor={card5.actor} title={card5.title} contents={card5.contents} />
                {(card5.cardType !== "BadPractice") && selectedCard === 5 && 
                    <div className={styles.tooltip}>
                        <img className={styles.iconOk} src={iconOk} alt="iconOk" />
                        <span className={styles.tooltiptext}>Valider</span>
                    </div>
                }
                {selectedCard === 5 && (
                    <div className={styles.tooltip}>
                        <img className={styles.iconBin} src={iconBin} alt="iconBin" />
                        <span className={styles.tooltiptext}>Défausser la carte</span>
                    </div>
                )}   
            </div>
            <div
                className={`${styles.card} ${selectedCard === 6 ? styles.selected : ''}`}
                onClick={() => handleCardClick(6)}
                onMouseEnter={() => handleCardHover(6)}
                onMouseLeave={handleCardLeave}>
                <BadPracticeCard cardType={card6.cardType} id={card6.id} title={card6.title} contents={card6.contents} targetedPlayer={card6.targetedPlayer} />
                {(card6.cardType !== "BadPractice") && selectedCard === 6 && 
                    <div className={styles.tooltip}>
                        <img className={styles.iconOk} src={iconOk} alt="iconOk" />
                        <span className={styles.tooltiptext}>Valider</span>
                    </div>
                }
                {selectedCard === 6 && (
                    <div className={styles.tooltip}>
                        <img className={styles.iconBin} src={iconBin} alt="iconBin" />
                        <span className={styles.tooltiptext}>Défausser la carte</span>
                    </div>
                )}   
            </div>
            <div
                className={`${styles.card} ${selectedCard === 7 ? styles.selected : ''}`}
                onClick={() => handleCardClick(7)}
                onMouseEnter={() => handleCardHover(7)}
                onMouseLeave={handleCardLeave}>
                <BestPracticeCard cardType={card7.cardType} id={card7.id} title={card7.title} contents={card7.contents} carbon_loss={card7.carbon_loss} />
                {(card7.cardType !== "BadPractice") && selectedCard === 7 && 
                    <div className={styles.tooltip}>
                        <img className={styles.iconOk} src={iconOk} alt="iconOk" />
                        <span className={styles.tooltiptext}>Valider</span>
                    </div>
                }
                {selectedCard === 7 && (
                    <div className={styles.tooltip}>
                        <img className={styles.iconBin} src={iconBin} alt="iconBin" />
                        <span className={styles.tooltiptext}>Défausser la carte</span>
                    </div>
                )}   
            </div>
        </div>
    );
}

export default PlayerHand;
