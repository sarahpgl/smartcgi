import React, { useState } from 'react';
import expertPO from '../../images/Expert_product_owner.webp';
import MPPO from '../../images/MP_product_owner.webp';
import expertD from '../../images/Expert_dev.webp';
import MPD from '../../images/MP_dev.webp';
import expertLT from '../../images/Expert_lead_tech.webp';
import MPLT from '../../images/MP_lead_tech.webp';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import styles from './OpponentBoard.module.css';

const OpponentBoard: React.FC = () => {

    const data = {
        name : "Pierre",
        kg: "900",
        points: "3",
        expert : "ProductOwner",
        MP : "Developer"
    };

    let expertImageSrc = null;
    if (data.expert === "Developer") {
        expertImageSrc = expertD;
    } else if (data.expert === "Architect") {
        expertImageSrc = expertLT;
    } else if (data.expert === "ProductOwner") {
        expertImageSrc = expertPO;
    }

    let mpImageSrc =null;
    if (data.MP === "Developer") {
        mpImageSrc = MPD;
    } else if (data.MP === "Architect") {
        mpImageSrc = MPLT;
    } else if (data.MP === "ProductOwner") {
        mpImageSrc = MPPO;
    }


    return (
        <div className={styles.opponentBoard}>
            <div className={styles.nameContainer}> </div>
            <div className={styles.container}>
            <label className={styles.labelname}>{data.name}</label>
                <div className={styles.container2}>
                    <label className={styles.label}>{data.kg}kg</label> <br />
                    {expertImageSrc && <img src={expertImageSrc} alt="Carte expert" className={styles.cardImage} />} <br />
                    {mpImageSrc && <img src={mpImageSrc} alt="Carte MP" className={styles.cardImage} />} <br />
                    <label className={styles.labelPoints}>{data.points} points de sensibilisation</label> <br />
                </div>
                <BestPracticeCard /> {}
            </div>
        </div>
        
    );
};

export default OpponentBoard;
