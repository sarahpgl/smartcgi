import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionnairePick.module.css';

const data = {
    points:3
};

const QuestionnairePick: React.FC = () => {
    const [createMessage, setCreateMessage] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const [answered, setAnswered] = useState(false);
    const navigate = useNavigate();

    const answer = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!answered) {
            const selectedOption = event.currentTarget.textContent;
            setCreateMessage(`Vous avez répondu ${selectedOption}`);
            setTimeout(() => {
                setIsVisible(false);
            }, 2000);
            setAnswered(true);
        }
    }

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>Voulez-vous piocher une carte d’une formation aléatoire contre {data.points > 1 ? '3' : '1'} point{data.points > 1 ? 's' : ''} de sensibilisation ?</label> <br />
            <div className={styles.buttonContainer}> {/* Conteneur pour les boutons */}
                <button className={answered ? styles.buttonDisabled : styles.button} onClick={answer} disabled={answered}>Oui</button>
                <button className={answered ? styles.buttonDisabled : styles.button} onClick={answer} disabled={answered}>Non</button>
            </div>
            {createMessage && <p className={styles.message}>{createMessage}</p>}
        </div>
    );
};

export default QuestionnairePick;
