import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionnaireMP.module.css';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { BestPracticeAnswerType } from '@shared/common/Game';

const QuestionnaireBP: React.FC = () => {
    const [createMessage, setCreateMessage] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();
    const { sm } = useSocketManager();

    const answer = (selectedOption: BestPracticeAnswerType) => {

        sm.emit({
            event: ClientEvents.AnswerPracticeQuestion,
            data: {
                cardId: 'cardId',
                answer: selectedOption,
            }
        });

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
            <label className={styles.label}>La bonne pratique est-elle :</label> <br />
            <button className={styles.button} onClick={() => answer(BestPracticeAnswerType.APPLICABLE)}>Applicable</button> <br />
            <button className={styles.button} onClick={() => answer(BestPracticeAnswerType.ALREADY_APPLICABLE)}>Déjà appliquée</button> <br />
            <button className={styles.button} onClick={() => answer(BestPracticeAnswerType.NOT_APPLICABLE)}>Non applicable</button> <br />
            {createMessage && <p className={styles.message}>{createMessage}</p>}
        </div>
    );
};

export default QuestionnaireBP;
