import React from 'react';

import styles from './MenuComponent.module.css';



const MenuComponent = () => {
    return (
        <div className={styles.container}>
            <button className={styles.button}>Créer une partie</button>
            <button className={styles.button}>Rejoindre une partie</button>
            <button className={styles.button}>Carnet Green IT</button>
            <button className={styles.button}>Règles du jeu</button>
            <button className={styles.button}>Visualiser les cartes</button>
            
        </div>
    );
};

export default MenuComponent;