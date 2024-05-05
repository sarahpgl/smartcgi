import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PracticeQuestion.module.css';
import useSocketManager from '@app/js/hooks/useSocketManager';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";
import { ClientEvents } from '@shared/client/ClientEvents';
import { BestPracticeAnswerType } from '@shared/common/Game';
import { BadPracticeAnswerType } from '@shared/common/Game';


const PracticeQuestion: React.FC<{ card: { type: string; id: string; title: string; contents: string; carbon_loss?: number; targetedPlayer?: string } }> = ({ card }) => {
    const [createMessage, setCreateMessage] = useState("");
    const [selectedOption, setSelectedOption] = useState<BestPracticeAnswerType | BadPracticeAnswerType | null>(null);
    const navigate = useNavigate();
    const { sm } = useSocketManager();

    const answer = (option: BestPracticeAnswerType | BadPracticeAnswerType) => { // Utilisez BestPracticeAnswerType ou BadPracticeAnswerType
        setSelectedOption(option);
        sm.emit({
            event: ClientEvents.AnswerPracticeQuestion,
            data: {
                cardId: card.id,
                answer: option,
            }
        });
        setCreateMessage(`Vous avez classé la ${card.type === 'BestPractice' ? 'bonne' : 'mauvaise'} pratique comme ${option}`);
    }


    return (
        <div className={styles.container}>
            <div className={styles.cardContainer}>
                {card.type === 'BestPractice' ? (
                    <BestPracticeCard 
                        id={card.id} 
                        title={card.title} 
                        contents={card.contents} 
                        carbon_loss={card.carbon_loss || 0}
                    />
                ) : (
                    <BadPracticeCard 
                        id={card.id} 
                        title={card.title} 
                        contents={card.contents} 
                        targetedPlayer={card.targetedPlayer || ''}
                    />
                )}
            </div>
            <div className={styles.questionnaireContainer}>
                <label className={styles.label}>La {card.type === 'BestPractice' ? 'bonne' : 'mauvaise'} pratique est-elle :</label> <br />
                {card.type === 'BestPractice' ? (
                    <>
                        <button className={`${styles.button} ${selectedOption === BestPracticeAnswerType.APPLICABLE ? styles.selected : ''}`} onClick={() => answer(BestPracticeAnswerType.APPLICABLE)}>Applicable</button> <br />
                        <button className={`${styles.button} ${selectedOption === BestPracticeAnswerType.ALREADY_APPLICABLE ? styles.selected : ''}`} onClick={() => answer(BestPracticeAnswerType.ALREADY_APPLICABLE)}>Déjà appliquée</button> <br />
                        <button className={`${styles.button} ${selectedOption === BestPracticeAnswerType.NOT_APPLICABLE ? styles.selected : ''}`} onClick={() => answer(BestPracticeAnswerType.NOT_APPLICABLE)}>Non applicable</button> <br />
                    </>
                ) : (
                    <>
                        <button className={`${styles.button} ${selectedOption === BadPracticeAnswerType.TO_BE_BANNED ? styles.selected : ''}`} onClick={() => answer(BadPracticeAnswerType.TO_BE_BANNED)}>Bannissable</button> <br />
                        <button className={`${styles.button} ${selectedOption === BadPracticeAnswerType.ALREADY_BANNED ? styles.selected : ''}`} onClick={() => answer(BadPracticeAnswerType.ALREADY_BANNED)}>Déjà bannie</button> <br />
                        <button className={`${styles.button} ${selectedOption === BadPracticeAnswerType.TOO_COMPLEX ? styles.selected : ''}`} onClick={() => answer(BadPracticeAnswerType.TOO_COMPLEX)}>Compliquée à éviter</button> <br />
                    </>
                )}
                {createMessage && <p className={styles.message}>{createMessage}</p>}
            </div>
        </div>
    );
};

export default PracticeQuestion;
