import React, { useState } from 'react';
import styles from './PlayerHand.module.css';

import BestPracticeCard from '../BestPracticeCard/BestPracticeCard';
import ExpertCard from '../ExpertCard/ExpertCard';
import BadPracticeCard from '../BadPracticeCard/BadPracticeCard';
import FormationCard from '../FormationCard/FormationCard';

import { BaseCard, Card } from '@shared/common/Cards';

import iconOk from '../../../icons/ok_icon.webp';
import iconBin from '../../../icons/bin_icon.webp';

import { Best_Practice_Card, Bad_Practice_Card, Expert_Card, Formation_Card } from '@shared/common/Cards';
import EmptyCard from '../EmptyCard/EmptyCard';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';

function PlayerHand({ MPSelected, noMPSelected, cards }: {
  MPSelected: (card: Bad_Practice_Card) => void,
  noMPSelected: () => void,
  cards: Card[],
}) {

  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const { sm } = useSocketManager();

  const handleCardClick = (cardId: number, cardType: string) => {
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

    const handleCardLeave = (cardType:string) => {
        if(typeSelected !== "BadPractice"){
            setSelectedCard(null);
        }
    };

  const handleCardHover = (cardId: number) => {
  };

  const handleCardLeave = (cardType: string) => {
    setSelectedCard(null);
  };
  
  const handlePlayCard = (card: Card) => {
    console.log("play card", card);
    sm.emit({
      event: ClientEvents.PlayCard,
      data: {
        card
      }
    })
  }

    return (
        <div className={styles.hand}>
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`${styles.card} ${selectedCard === index ? styles.selected : ''}`}
                    onClick={() => handleCardClick(index,card.cardType)}
                    onMouseEnter={() => handleCardHover(index)}
                    onMouseLeave={() => handleCardLeave(card.cardType)}
                >
                    {card.cardType === 'BestPractice' && (
                        <BestPracticeCard cardType={card.cardType} id={card.id} title={card.title} contents={card.contents} carbon_loss={card.carbon_loss} />
                    )}
                    {card.cardType === 'BadPractice' && (
                        <BadPracticeCard cardType={card.cardType} id={card.id} title={card.title} contents={card.contents} targetedPlayer={card.targetedPlayer} />
                    )}
                    {card.cardType === 'Expert' && (
                        <ExpertCard cardType={card.cardType} id={card.id} actor={card.actor} title={card.title} contents={card.contents} />
                    )}
                    {card.cardType === 'Formation' && (
                        <FormationCard cardType={card.cardType} id={card.id} actor={card.actor} title={card.title} contents={card.contents} />
                    )}
                    {(card.cardType !== "BadPractice") && selectedCard === index && 
                        <div className={styles.tooltip}>
                            <img onClick={() => handlePlayCard(card)} className={styles.iconOk} src={iconOk} alt="iconOk" />
                            <span className={styles.tooltiptext} style={{backgroundColor: "rgba(0, 105, 0, 0.8)"}}>Valider la carte</span>
                        </div>
                    }
                    {selectedCard === index && (
                        <div className={styles.tooltip}>
                            <img onClick={()=>window.alert("La carte ''"+ card.title+"'' " + index + " a été défaussée")} className={styles.iconBin} src={iconBin} alt="iconBin" />
                            <span className={styles.tooltiptext} style={{backgroundColor: "rgba(165, 0, 0, 0.8)"}}>Défausser la carte</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default PlayerHand;
