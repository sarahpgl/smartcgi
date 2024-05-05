import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuestionnaireMP.module.css';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { BadPracticeAnswerType } from '@shared/common/Game';

const QuestionnaireMP: React.FC = () => {
    const [createMessage, setCreateMessage] = useState("");
    const [selectedOption, setSelectedOption] = useState<BadPracticeAnswerType | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();
    const { sm } = useSocketManager();

    const answer = (selectedOption: BadPracticeAnswerType) => {
        setSelectedOption(selectedOption);
        sm.emit({
            event: ClientEvents.AnswerPracticeQuestion,
            data: {
                cardId: 'cardId',
                answer: selectedOption,
            }
        });

        setCreateMessage(`Vous avez classé la mauvaise pratique comme ${selectedOption}`);
    }

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>La mauvaise pratique est-elle :</label> <br />
            <button className={`${styles.button} ${selectedOption === BadPracticeAnswerType.TO_BE_BANNED ? styles.selected : ''}`} onClick={() => answer(BadPracticeAnswerType.TO_BE_BANNED)}>Bannissable</button> <br />
            <button className={`${styles.button} ${selectedOption === BadPracticeAnswerType.ALREADY_BANNED ? styles.selected : ''}`} onClick={() => answer(BadPracticeAnswerType.ALREADY_BANNED)}>Déjà bannie</button> <br />
            <button className={`${styles.button} ${selectedOption === BadPracticeAnswerType.TOO_COMPLEX ? styles.selected : ''}`} onClick={() => answer(BadPracticeAnswerType.TOO_COMPLEX)}>Compliquée à éviter</button> <br />
            {createMessage && <p className={styles.message}></p>}
        </div>
    );
};

export default QuestionnaireMP;
