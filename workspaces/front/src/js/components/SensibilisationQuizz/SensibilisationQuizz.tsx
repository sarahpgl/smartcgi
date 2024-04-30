import React, { useState, useEffect } from 'react';
import styles from './SensibilisationQuizz.module.css';

const Quizz: React.FC = () => {

    const data = {
        question: "Visionner un film en basse résolution plutôt qu’en haute définition, divise de combien la consommation d’énergie totale nécessaire ?",
        answer1: "Entre 2 et 4 fois",
        answer2: "Entre 4 et 10 fois",
        answer3: "Entre 10 et 20 fois",
        answerTrue: 2
    };
    const [answerCorrect, setanswerCorrect] = useState(false);

    const [resultMessage, setResultMessage] = useState("");
    const [answerChoisie, setanswerChoisie] = useState<number | null>(null);
    const [quizzPlay, setQuizzPlay] = useState(false);
    const [tempsRestant, setTempsRestant] = useState(15);
    
    useEffect(() => {
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

    const handleResult = (answerIndex: number) => {
        if (!quizzPlay) {
            if (answerIndex === data.answerTrue) {
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
            if (answerIndex === data.answerTrue) {
                return styles.green;
            }
            if (answerIndex !== data.answerTrue && answerIndex === answerChoisie) {
                return styles.red;
            }
        }
        return '';
    };

    return (
        <div className={styles.container}>
            <label className={styles.titre}>Quizz de sensibilisation</label> <br />
            <label className={styles.label}>{data.question}</label> <br />
            <button className={`${styles.button} ${getButtonColor(1)}`} onClick={() => handleResult(1)} disabled={quizzPlay}>{data.answer1}</button> <br />
            <button className={`${styles.button} ${getButtonColor(2)}`} onClick={() => handleResult(2)} disabled={quizzPlay}>{data.answer2}</button> <br />
            <button className={`${styles.button} ${getButtonColor(3)}`} onClick={() => handleResult(3)} disabled={quizzPlay}>{data.answer3}</button> <br />
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
