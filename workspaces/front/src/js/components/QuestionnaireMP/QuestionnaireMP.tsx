import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionnaireMP.module.css';

const QuestionnaireMP: React.FC = () => {
    const [createMessage, setCreateMessage] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();

    const answer = (event: React.MouseEvent<HTMLButtonElement>) => {
        const selectedOption = event.currentTarget.textContent;
        setCreateMessage(`Vous avez classé la mauvaise pratique comme ${selectedOption}`);
        setTimeout(() => {
            setIsVisible(false);
        }, 2000);
    }

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>La mauvaise pratique est-elle :</label> <br />
            <button className={styles.button} onClick={answer}>A bannir</button> <br />
            <button className={styles.button} onClick={answer}>Déjà bannie</button> <br />
            <button className={styles.button} onClick={answer}>Compliquée à bannir</button> <br />
            {createMessage && <p className={styles.message}>{createMessage}</p>}
        </div>
    );
};

export default QuestionnaireMP;
