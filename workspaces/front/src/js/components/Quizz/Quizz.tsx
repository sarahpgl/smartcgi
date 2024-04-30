import React, { useState, useEffect } from 'react';
import styles from './Quizz.module.css';

const Quizz: React.FC = () => {

    const data = {
        question: "Visionner un film en basse résolution plutôt qu’en haute définition, divise de combien la consommation d’énergie totale nécessaire ?",
        reponse1: "Entre 2 et 4 fois",
        reponse2: "Entre 4 et 10 fois",
        reponse3: "Entre 10 et 20 fois",
        reponseVraie: 2
    };
    const [reponseCorrecte, setReponseCorrecte] = useState(false);

    const [resultatMessage, setResultatMessage] = useState("");
    const [reponseChoisie, setReponseChoisie] = useState<number | null>(null);
    const [quizzJoue, setQuizzJoue] = useState(false);
    const [tempsRestant, setTempsRestant] = useState(10);
    
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (tempsRestant > 0) {
            timer = setTimeout(() => {
                setTempsRestant(tempsRestant - 1);
            }, 1000);
        } else if (!quizzJoue && tempsRestant === 0) {
            setResultatMessage("Temps écoulé !");
            setQuizzJoue(true);
        }

        return () => clearTimeout(timer);
    }, [quizzJoue, tempsRestant]);

    const handleResultat = (reponseIndex: number) => {
        if (!quizzJoue) {
            if (reponseIndex === data.reponseVraie) {
                setResultatMessage(`Bien joué, vous avez gagné un point de sensibilisation !`);
                setReponseCorrecte(true);
            } else {
                setResultatMessage(`Dommage, ce n’est pas la bonne réponse !`);
            }
            setReponseChoisie(reponseIndex);
            setQuizzJoue(true);
        }
    };

    const getButtonColor = (reponseIndex: number) => {
        if (quizzJoue) {
            if (reponseIndex === data.reponseVraie) {
                return styles.green;
            }
            if (reponseIndex !== data.reponseVraie && reponseIndex === reponseChoisie) {
                return styles.red;
            }
        }
        return '';
    };

    return (
        <div className={styles.container}>
            <label className={styles.titre}>Quizz de sensibilisation</label> <br />
            <label className={styles.label}>{data.question}</label> <br />
            <button className={`${styles.button} ${getButtonColor(1)}`} onClick={() => handleResultat(1)} disabled={quizzJoue}>{data.reponse1}</button> <br />
            <button className={`${styles.button} ${getButtonColor(2)}`} onClick={() => handleResultat(2)} disabled={quizzJoue}>{data.reponse2}</button> <br />
            <button className={`${styles.button} ${getButtonColor(3)}`} onClick={() => handleResultat(3)} disabled={quizzJoue}>{data.reponse3}</button> <br />
            {resultatMessage && <p className={styles.message}>{resultatMessage}</p>}
            {(tempsRestant > 0 &&
                <div>
                    <p>Temps restant: {tempsRestant} secondes</p>
                </div>
            )}
        </div>
    );
};

export default Quizz;
