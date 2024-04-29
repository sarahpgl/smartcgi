import React from 'react';

import styles from './CreateGame.module.css';

const CreateGame: React.FC = () => {
    return (
        <div className={styles.container}>
            <label className={styles.label}>kg de CO2 à économiser</label> <br />
            <input className={styles.inputco2} type="text" /> <br />
            <label className={styles.label}>Rejoindre avec le pseudo : </label> <br />
            <input className={styles.input} type="text" /> <br />
            <button className={styles.button}>Créer la partie</button> <br />
        </div>
    );
};

export default CreateGame;
