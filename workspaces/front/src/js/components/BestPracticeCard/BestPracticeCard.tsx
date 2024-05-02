import React, { useState } from 'react';

import styles from './BestPracticeCard.module.css';
import iconBestPractice from '@app/icons/icon_goodpractice.webp';
import actorIcon from '@app/icons/actor_icon.webp';
import { Best_Practice_Card } from '@shared/common/Cards';

function BestPracticeCard(card:Best_Practice_Card) {


    return (
        <div className={styles.card}>
            <div className={styles.cardheader}>
                <div className={styles.icon}>
                    <img src={iconBestPractice} alt="iconBestPractice" />
                </div>
                <h2>Bonne pratique</h2>
            </div>
            <div className={styles.cardPoids}>
                <p>{card.carbon_loss >= 0 && card.carbon_loss <= 200 ? card.carbon_loss : "?? "} KG</p>
            </div>
            <div className={styles.cardbody}>
                <p>CO2 économisés</p>
            </div>

            <div className={styles.description}>
                <div className={styles.descriptionheader}>
                    <h3>{card.title ? card.title : "Sample title"}</h3>
                </div>
                <div className={styles.descriptionbody}>
                    <p>{card.contents? card.contents : "blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla "}</p>
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
                        <span>{card.difficulty>0? "★" : "☆"}</span>
                        <span>{card.difficulty>1? "★" : "☆"}</span>
                        <span>{card.difficulty>2? "★" : "☆"}</span>
                        <span>{card.difficulty>3? "★" : "☆"}</span>
                        </div>
                    </div>

            </div>

        </div>

    );
}

export default BestPracticeCard;
