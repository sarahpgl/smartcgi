import React, { useState, useEffect } from 'react';
import styles from './SensibilisationQuizz.module.css';
import useSocketManager from '@app/js/hooks/useSocketManager';
import { ClientEvents } from '@shared/client/ClientEvents';
import { useRecoilState } from 'recoil';
import { CurrentSensibilisationQuestion } from '../Game/states';

const Quizz: React.FC = () => {
  const { sm } = useSocketManager();
  const [sensibilisationQuestion, setSensibilisationQuestion] = useRecoilState(CurrentSensibilisationQuestion);
  const [answerCorrect, setanswerCorrect] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [answerChoisie, setanswerChoisie] = useState<number | null>(null);
  const [quizzPlay, setQuizzPlay] = useState(false);
  const [tempsRestant, setTempsRestant] = useState(15);
  const [showComponent, setShowComponent] = useState(true);
  const [timeIsUp, setTimeIsUp] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (tempsRestant > 0) {
      timer = setTimeout(() => {
        setTempsRestant(tempsRestant - 1);
      }, 1000);
    } else {
      setTimeIsUp(true);
    }

    return () => clearTimeout(timer);
  }, [tempsRestant]);

  useEffect(() => {
    if (timeIsUp && !quizzPlay) {
      sm.emit({
        event: ClientEvents.AnswerSensibilisationQuestion,
        data: {
          questionId: sensibilisationQuestion.question_id,
          answer: null,
        }
      })
      if(sensibilisationQuestion?.answers.answer == 1){
        setResultMessage(`La bonne réponse est : ${sensibilisationQuestion?.answers.response1}`);
      } else if(sensibilisationQuestion?.answers.answer == 2){
        setResultMessage(`La bonne réponse est : ${sensibilisationQuestion?.answers.response2}`);
      } else if(sensibilisationQuestion?.answers.answer == 3){
        setResultMessage(`La bonne réponse est : ${sensibilisationQuestion?.answers.response3}`);
      }
      setTimeout(() => {
        setShowComponent(false);
      }, 3000);
    } else if (timeIsUp && quizzPlay) {
      setTimeout(() => {
        setShowComponent(false);
      }, 3000);
    }
  }, [timeIsUp, quizzPlay, sensibilisationQuestion]);

  const handleotherclick = () => {
    setSensibilisationQuestion(null);
  }

  const handleResult = async (answerIndex: number) => {
    const answ = {
      answer: answerIndex,
    };

    sm.emit({
      event: ClientEvents.AnswerSensibilisationQuestion,
      data: {
        questionId: sensibilisationQuestion.question_id,
        answer: answ,
      }
    })

    if (!quizzPlay) {
      if (sensibilisationQuestion?.answers.answer == answerIndex) {
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
      if (answerIndex == sensibilisationQuestion?.answers.answer) {
        return styles.green;
      }
      if (answerIndex !== sensibilisationQuestion?.answers.answer && answerIndex === answerChoisie) {
        return styles.red;
      }
    }
    return '';
  };

  return showComponent && sensibilisationQuestion !== null ? (
    <div className={styles.container}>
      <label className={styles.titre}>Quizz de sensibilisation</label> <br />
      <label className={styles.label}>{sensibilisationQuestion?.question}</label> <br />
      <button className={`${styles.button} ${getButtonColor(1)}`} onClick={() => handleResult(1)} disabled={quizzPlay}>{sensibilisationQuestion?.answers.response1}</button> <br />
      <button className={`${styles.button} ${getButtonColor(2)}`} onClick={() => handleResult(2)} disabled={quizzPlay}>{sensibilisationQuestion?.answers.response2}</button> <br />
      <button className={`${styles.button} ${getButtonColor(3)}`} onClick={() => handleResult(3)} disabled={quizzPlay}>{sensibilisationQuestion?.answers.response3}</button> <br />
      {resultMessage && <p className={styles.message}>{resultMessage}</p>}
      {(tempsRestant > 0 &&
        <div style={{ marginBottom: "15px" }}>
          <p>Temps restant: {tempsRestant} secondes</p>
        </div>
      )}
    </div>
  ) : null;
};

export default Quizz;
