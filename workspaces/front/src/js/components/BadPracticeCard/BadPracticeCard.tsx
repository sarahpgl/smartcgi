import React, { useState } from 'react';

import styles from './BadPracticeCard.module.css';
import iconMPDeveloper from '../../images/MP_dev.webp';
import iconMPProductOwner from '../../images/MP_product_owner.webp';
import iconMPLeadTech from '../../images/MP_lead_tech.webp';
import actorIcon from '@app/icons/actor_icon.webp';


import { Bad_Practice_Card, Difficulty } from '@shared/common/Cards';

function BadPracticeCard(card:Bad_Practice_Card) {

    let dif=card.difficulty;

    let imgSrc = iconMPDeveloper;
    if(card.actor === "ProductOwner"){
        imgSrc = iconMPProductOwner;
    }
    else if(card.actor === "Architect"){
        imgSrc = iconMPLeadTech;
    }
    else {
        imgSrc = iconMPDeveloper;
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardheader}>
                <div className={styles.icon}>
                    <img src={imgSrc} alt="iconBadPractice" />
                </div>
                <h2>Mauvaise pratique</h2>
            </div>


            <div className={styles.description}>
                <div className={styles.descriptionheader}>
                    <h3>{card.title ? card.title : "Sample title"}</h3>
                </div>
                <div className={styles.descriptionbody}>
                    <p>{card.contents? card.contents : "Sample blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla "}</p>
                </div>
            </div>

            <div className={styles.cardfooter}>
                <div className={styles.actor}>
                    <p>Acteur</p>
                    <div className={styles.footericon}>
                        <img src={actorIcon} alt="actorIcon" />
                        </div>
                </div>
                <div className={styles.component}>
                    <p>Composant</p>
                    <div className={styles.footericon}>
                        <img src={actorIcon} alt="actorIcon" />
                        </div>
                </div>
                <div className={styles.gains}>
                    <p>Gains</p>
                    <div className={styles.footericon}>
                        <img src={actorIcon} alt="actorIcon" />
                        </div>
                </div>
                <div className={styles.difficulty}>
                    <p>Difficulté</p>
                    <div className={styles.stars}>
                        <span>{dif===Difficulty.ONE? "★☆☆☆" : ""}</span>
                        <span>{dif===Difficulty.TWO? "★★☆☆" : ""}</span>
                        <span>{dif===Difficulty.THREE? "★★★☆" : ""}</span>
                        <span>{dif===Difficulty.FOUR? "★★★★" : ""}</span>
                        </div>
                    </div>

            </div>

        </div>

    );
}

export default BadPracticeCard;
