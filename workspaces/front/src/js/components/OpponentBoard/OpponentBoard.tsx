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
import { PlayerStateInterface, PublicPlayerState } from '@shared/common/Game';

const OpponentBoard: React.FC = () => {

    const data = {
        name : "Jean",
        kg: "900",
        points: "3",
        expert : ["Developer", "ProductOwner", "Architect"],
        MP : "Developer"
    };

    let player: PlayerStateInterface = {
        co2Saved: 900,
        sensibilisationPoints: 3,
        expertCards: ["Developer", "ProductOwner", "Architect"],
        badPractice: "Developer",
        playerName: "Jean",
        cardsInHand: [],
        practiceAnswers: [],
        playerId: '',
        canPlay: false,
        cardsHistory: []
    };

    return (
        <div className={styles.opponentBoard}>
            <div className={styles.nameContainer}> </div>
            <div className={styles.container}>
            <img src={userIcon} alt="user icon" className={styles.userIcon} />
            <label className={styles.labelname}>{data.name}</label>

            <div className={styles.container2}>
                <PlayerStatus playerstate={player} />
                </div>
                
                <BestPracticeCard /> {}
            </div>
        </div>
        
    );
};

export default OpponentBoard;
