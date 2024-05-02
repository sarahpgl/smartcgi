import React, { useState, useEffect } from 'react';
import styles from './SensibilisationQuizz.module.css';
import Instance from "@app/"
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { Listener } from '@components/websocket/types';

import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';


const Quizz: React.FC = () => {
    const {sm,socket} = useSocketManager();

//futur data de la question
    const d = {
        question_content :"",
        question_id : 0,
        answer1: 0,
        answer2: 0,
        answer3: 0,
        answerTrue: 0
    };


    
   

    const [answerCorrect, setanswerCorrect] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [answerChoisie, setanswerChoisie] = useState<number | null>(null);
    const [quizzPlay, setQuizzPlay] = useState(false);
    const [tempsRestant, setTempsRestant] = useState(15);

    
    useEffect(() => {
        //un listener pour get la question de sensibilisation 
        const onSensibilisationState: Listener<ServerPayloads[ServerEvents.GetSensibilisationQuestion]> = async (data) => {
            console.log(data);
            
            d.question_content = data.question ;
            d.question_id = data.question_id;
            d.answer1 = data.answers.response1;
            d.answer2 = data.answers.response2;
            d.answer3 = data.answers.response3;
            d.answerTrue= data.answers.answer;
          };
          
      
          if (!socket.connected) {
            sm.connect();
          }
          if (!sm.socket.hasListeners(ServerEvents.GetSensibilisationQuestion)) sm.registerListener(ServerEvents.LobbyState, onSensibilisationState);
    
      
          return () => {
            sm.removeListener(ServerEvents.GetSensibilisationQuestion, onSensibilisationState);
          };


        let timer: NodeJS.Timeout;

        if (tempsRestant > 0) {
            timer = setTimeout(() => {
                setTempsRestant(tempsRestant - 1);
            }, 1000);
        } else if (!quizzPlay && tempsRestant === 0) {
            setResultMessage("Temps écoulé !");
            setQuizzPlay(true);
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
                questionId: d.question_id,
                answer: answ,
            }
        })

        if (!quizzPlay) {
            if (d.answerTrue ==answerIndex) {
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
            if (answerIndex === d.answerTrue) {
                return styles.green;
            }
            if (answerIndex !== d.answerTrue && answerIndex === answerChoisie) {
                return styles.red;
            }
        }
        return '';
    };

    return (
        <div className={styles.container}>
            <label className={styles.titre}>Quizz de sensibilisation</label> <br />
            <label className={styles.label}>{d.question_content}</label> <br />
            <button className={`${styles.button} ${getButtonColor(1)}`} onClick={() => handleResult(1)} disabled={quizzPlay}>{d.answer1}</button> <br />
            <button className={`${styles.button} ${getButtonColor(2)}`} onClick={() => handleResult(2)} disabled={quizzPlay}>{d.answer2}</button> <br />
            <button className={`${styles.button} ${getButtonColor(3)}`} onClick={() => handleResult(3)} disabled={quizzPlay}>{d.answer3}</button> <br />
            {resultMessage && <p className={styles.message}>{resultMessage}</p>}
            {(tempsRestant > 0 &&
                <div>
                    <p>Temps restant: {tempsRestant} secondes</p>
                </div>
            )}
        </div>
    );
};

export default Quizz;
