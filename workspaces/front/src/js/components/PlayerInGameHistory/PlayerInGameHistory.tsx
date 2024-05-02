import React, { useState } from 'react';

import styles from './PlayerInGameHistory.module.css';

import BestPracticeCard from '@app/js/components/BestPracticeCard/BestPracticeCard';
import BadPracticeCard from '../BadPracticeCard/BadPracticeCard';
import ExpertCard from '../ExpertCard/ExpertCard';
import FormationCard from '../FormationCard/FormationCard';

import { BaseCard } from '@shared/common/Cards';

function PlayerInGameHistory() {

    let cards: BaseCard[] = [
        { cardType: 'BadPractice', id: '32', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { cardType: 'BestPractice', id: '32', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss : 150 },
        { cardType: 'Expert', id: '32', actor: 'ProductOwner', title: 'titre de la carte', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
        { cardType: 'Formation', id: '32', actor: 'ProductOwner', title: 'titre de la carte', contents: 'blablabla blabal blabal' }
    ];        


    return (
        <div className={styles.hand}>
            {cards.slice(-3).map((card, index) => (
                <div key={index} className={`${styles.hand}`}>
                    {card.cardType === 'BestPractice' && (
                        <BestPracticeCard
                            cardType={card.cardType}
                            id={card.id}
                            title={card.title}
                            contents={card.contents}
                            carbon_loss={card.carbon_loss}
                        />
                    )}
                    {card.cardType === 'BadPractice' && (
                        <BadPracticeCard
                            cardType={card.cardType}
                            id={card.id}
                            title={card.title}
                            contents={card.contents}
                            targetedPlayer={card.targetedPlayer}
                        />
                    )}
                    {card.cardType === 'Expert' && (
                        <ExpertCard
                            cardType={card.cardType}
                            id={card.id}
                            actor={card.actor}
                            title={card.title}
                            contents={card.contents}
                        />
                    )}
                    {card.cardType === 'Formation' && (
                        <FormationCard
                            cardType={card.cardType}
                            id={card.id}
                            actor={card.actor}
                            title={card.title}
                            contents={card.contents}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default PlayerInGameHistory;
