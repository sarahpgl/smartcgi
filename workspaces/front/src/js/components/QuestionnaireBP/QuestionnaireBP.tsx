import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionnaireBP.module.css';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { BestPracticeAnswerType } from '@shared/common/Game';

const QuestionnaireBP: React.FC = () => {
    const [createMessage, setCreateMessage] = useState("");
    const [selectedOption, setSelectedOption] = useState<BestPracticeAnswerType | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();
    const { sm } = useSocketManager();

    const answer = (option: BestPracticeAnswerType) => {
        setSelectedOption(option); 
        sm.emit({
            event: ClientEvents.AnswerPracticeQuestion,
            data: {
                cardId: 'cardId',
                answer: option,
            }
        });
        setCreateMessage(`Vous avez classé la bonne pratique comme ${option}`);
    }

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>La bonne pratique est-elle :</label> <br />
            <button className={`${styles.button} ${selectedOption === BestPracticeAnswerType.APPLICABLE ? styles.selected : ''}`} onClick={() => answer(BestPracticeAnswerType.APPLICABLE)}>Applicable</button> <br />
            <button className={`${styles.button} ${selectedOption === BestPracticeAnswerType.ALREADY_APPLICABLE ? styles.selected : ''}`} onClick={() => answer(BestPracticeAnswerType.ALREADY_APPLICABLE)}>Déjà appliquée</button> <br />
            <button className={`${styles.button} ${selectedOption === BestPracticeAnswerType.NOT_APPLICABLE ? styles.selected : ''}`} onClick={() => answer(BestPracticeAnswerType.NOT_APPLICABLE)}>Non applicable</button> <br />
            {createMessage && <p className={styles.message}></p>}
        </div>
    );
};


export default QuestionnaireBP;