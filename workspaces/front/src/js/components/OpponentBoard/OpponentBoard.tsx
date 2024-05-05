import React, { useState } from 'react';
import expertPO from '../../images/Expert_product_owner.webp';
import MPPO from '../../images/MP_product_owner.webp';
import expertD from '../../images/Expert_dev.webp';
import MPD from '../../images/MP_dev.webp';
import expertLT from '../../images/Expert_lead_tech.webp';
import MPLT from '../../images/MP_lead_tech.webp';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import styles from './OpponentBoard.module.css';
import userIcon from '../../../icons/user_icon.webp';
import PlayerStatus from '../PlayerStatus/PlayerStatus';
import { PlayerStateInterface } from '@shared/common/Game';
import BadPracticeCard from '../BadPracticeCard/BadPracticeCard';
import ExpertCard from '../ExpertCard/ExpertCard';
import FormationCard from '../FormationCard/FormationCard';

function OpponentBoard({ playerState, myTurn }: { playerState: PlayerStateInterface , myTurn: boolean}) {
    //console.log('PlayerState dans oponnentBoard', playerState);

    const data = {
        name: "Jean",
        kg: "900",
        points: "3",
        expert: ["Developer", "ProductOwner", "Architect"],
        MP: "Developer"
    };

    let player: PlayerStateInterface = {
        co2Saved: 900,
        sensibilisationPoints: 3,
        expertCards: ["Developer", "ProductOwner", "Architect"],
        badPractice: "Developer",
        playerName: "Zizi",
        cardsInHand: [],
        practiceAnswers: [],
        playerId: '',
        canPlay: false,
        cardsHistory: []
    };

    //const lastThreeCards = playerState.cardsHistory.slice(-3);
    const lastThreeCards: BaseCard[] = [
        { cardType: 'Formation', id: '32', actor: 'ProductOwner', title: 'VIDE', contents: 'blablabla blabal blabal' }
    ];


    // Cartes par défaut
    const defaultCards: BaseCard[] = [
        { cardType: 'BadPractice', id: '32', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', targetedPlayer: 'Pierre' },
        { cardType: 'BestPractice', id: '32', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ', carbon_loss: 150 },
        { cardType: 'Expert', id: '32', actor: 'ProductOwner', title: 'VIDE', contents: 'blabla blabla blabla blabla blabla blabla blabla blabla blabla ' },
        { cardType: 'Formation', id: '32', actor: 'ProductOwner', title: 'VIDE', contents: 'blablabla blabal blabal' }
    ];

    const cards = [...defaultCards.slice(0, 3 - lastThreeCards.length),...lastThreeCards];

    

    return (
        <div className={styles.opponentBoard}>
            <div className={styles.nameContainer}> </div>
            <div className={`${styles.container} ${myTurn ? styles.containerMyTurn : ''}`}>
                <img src={userIcon} alt="user icon" className={styles.userIcon} />
                <label className={styles.labelname}>{playerState.playerName}</label>

                <div className={styles.container2}>
                    <PlayerStatus playerstate={playerState} me={0} />
                </div>

                <div className={styles.opponentHistory}>
                    {cards.slice(-3).map((card, index) => (
                        <div key={index} className={`${styles.card}`}>
                            {card.cardType === 'BestPractice' && (
                                <BestPracticeCard
                                    cardType={card.cardType}
                                    id={card.id}
                                    title={card.title}
                                    contents={card.contents}
                                    carbon_loss={card.carbon_loss} network_gain={false} memory_gain={false} cpu_gain={false} storage_gain={false} difficulty={"c:/Users/thiba/Desktop/Devoir/4IF/S2/SMART/smartcgi/workspaces/shared/common/Cards".ONE} actor={'ProductOwner'} />
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
                                    contents={card.contents} linkToFormation={''} />
                            )}
                        </div>
                    ))}
                </div>

            </div>

        </div>

    );
};

export default OpponentBoard;