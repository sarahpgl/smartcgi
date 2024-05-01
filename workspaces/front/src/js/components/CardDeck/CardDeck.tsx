import React, { useState } from 'react';
import styles from './CardDeck.module.css';

import piocheImage from '../../../icons/pioche.webp';

function PlayerHand() {

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("pioche");
    }


    return (
        <div className={styles.tooltip}>
            <img src={piocheImage} alt="Pioche" className={styles.deckImage} onClick={handleSubmit} />
            <span className={styles.tooltiptext}>Piocher une carte</span>
        </div>
    );
}

export default PlayerHand;
