import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionnaireBP.module.css';

const QuestionnaireBP: React.FC = () => {
    const [createMessage, setCreateMessage] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();

    const answer = (event: React.MouseEvent<HTMLButtonElement>) => {
        const selectedOption = event.currentTarget.textContent;
        setCreateMessage(`Vous avez classé la bonne pratique comme ${selectedOption}`);
        setTimeout(() => {
            setIsVisible(false);
        }, 2000);
    }

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>La bonne pratique est-elle :</label> <br />
            <button className={styles.button} onClick={answer}>Applicable</button> <br />
            <button className={styles.button} onClick={answer}>Appliquée</button> <br />
            <button className={styles.button} onClick={answer}>Non appliquable</button> <br />
            {createMessage && <p className={styles.message}>{createMessage}</p>}
        </div>
    );
};

export default QuestionnaireBP;
