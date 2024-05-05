import React, { useState, useEffect } from 'react';
import styles from './SensibilisationQuizz.module.css';
import Instance from "@app/"
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { Listener } from '@components/websocket/types';
import { useRecoilState } from 'recoil';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { CurrentSensibilisationQuestion } from '../Game/states';


const Quizz: React.FC = () => {
    const {sm,socket} = useSocketManager();
    const [sensibilisationQuestion] = useRecoilState(CurrentSensibilisationQuestion);
    const [answerCorrect, setanswerCorrect] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [answerChoisie, setanswerChoisie] = useState<number | null>(null);
    const [quizzPlay, setQuizzPlay] = useState(false);
    const [tempsRestant, setTempsRestant] = useState(15);
    const [showQuizz, setShowQuizz] = useState(true)
    useEffect(() => {
        let timer: NodeJS.Timeout;
    
        if (tempsRestant > 0) {
            timer = setTimeout(() => {
                setTempsRestant(tempsRestant - 1);
            }, 1000);
        } else if (!quizzPlay && tempsRestant === 0) {
            setResultMessage("Temps écoulé !");
            setQuizzPlay(true);
            
            setTimeout(() => {
                setShowQuizz(false);    
            }, 2000);
        }
    
        return () => clearTimeout(timer);
    }, [quizzPlay, tempsRestant]);
    


// au clic
    const handleResult = async (answerIndex: number) => {


        const answ = {
            answer: answerIndex,
        };
        // envoie de la réponse du client au serveur
        sm.emit({
            event: ClientEvents.AnswerSensibilisationQuestion,
            data: {
                questionId: sensibilisationQuestion.question_id,
                answer: answ,
            }
        })

        if (!quizzPlay) {
            if (sensibilisationQuestion?.answers.answer==answerIndex) {
                setResultMessage(`Bien joué, vous avez gagné un point de sensibilisation !`);
                setanswerCorrect(true);
            } else {
                setResultMessage(`Dommage, ce n’est pas la bonne réponse !`);
            }
            setanswerChoisie(answerIndex);
            setQuizzPlay(true);
        }
       
    }; 

    

    const getButtonColor = (answerIndex: number) => {
        if (quizzPlay) {
            if (answerIndex ==sensibilisationQuestion?.answers.answer) {
                return styles.green;
            }
            if (answerIndex !== sensibilisationQuestion?.answers.answer && answerIndex === answerChoisie) {
                return styles.red;
            }
        }
        return '';
    };
    const getData = () =>{
        sm.emit({
            event: ClientEvents.GetSensibilisationQuestion,
            data: {
            }
        })
        
    }


    return showQuizz ? (
        <div className={styles.container }>
            <label className={styles.titre}>Quizz de sensibilisation</label> <br />
            <label className={styles.label}>{sensibilisationQuestion?.question}</label> <br />
            <button className={`${styles.button} ${getButtonColor(1)}`} onClick={() => handleResult(1)} disabled={quizzPlay}>{sensibilisationQuestion?.answers.response1}</button> <br />
            <button className={`${styles.button} ${getButtonColor(2)}`} onClick={() => handleResult(2)} disabled={quizzPlay}>{sensibilisationQuestion?.answers.response2}</button> <br />
            <button className={`${styles.button} ${getButtonColor(3)}`} onClick={() => handleResult(3)} disabled={quizzPlay}>{sensibilisationQuestion?.answers.response3}</button> <br />
            {resultMessage && <p className={styles.message}>{resultMessage}</p>}
            {(tempsRestant > 0 &&
                <div style={{marginBottom: "15px"}}>
                <p>Temps restant: {tempsRestant} secondes</p>
                </div>
            )}
            <button onClick={getData}></button>
        </div>
    ) : null ;
};

export default Quizz;
