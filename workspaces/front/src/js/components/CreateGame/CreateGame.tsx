import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateGame.module.css';
import Lobby from '../../pages/lobby/lobby';

const CreateGame: React.FC = () => {
    const [co2Value, setCo2Value] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [pseudoErrorMessage, setPseudoErrorMessage] = React.useState("");
    const [pseudo, setPseudo] = React.useState("");
    const [createGameMessage, setCreateGameMessage] = React.useState("");

    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCo2Value(event.target.value);
    };

    const handlePseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPseudo(event.target.value);
    };

    const handleCreateGame = () => {
        if (co2Value === "" || Number(co2Value) < 500 || Number(co2Value) > 1000) {
            setErrorMessage("Veuillez entrer une valeur entre 500 et 1000");
        } else {
            setErrorMessage("");
        }

        if (pseudo === "") {
            setPseudoErrorMessage("Veuillez entrer un pseudo");
        } else {
            setPseudoErrorMessage("");
            if (co2Value !== "" && Number(co2Value) >= 500 && Number(co2Value) <= 1000) {
                setErrorMessage("");
                setCreateGameMessage(`Partie créée avec ${co2Value}kg de CO2 à économiser et le pseudo ${pseudo}`);
                
                // Redirect to Lobby page
                navigate("/lobby");
            } else {
                setErrorMessage("Veuillez entrer une valeur entre 500 et 1000");
            }
        }
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>kg de CO2 à économiser</label> <br />
            <input className={styles.inputco2} type="text" value={co2Value} onChange={handleInputChange} /> <br />
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            <label className={styles.label}>Rejoindre avec le pseudo : </label> <br />
            <input className={styles.input} type="text" value={pseudo} onChange={handlePseudoChange} /> <br />
            {pseudoErrorMessage && <p className={styles.error}>{pseudoErrorMessage}</p>}
            <button className={styles.button} onClick={handleCreateGame}>Créer la partie</button> <br />
            {createGameMessage && <p className={styles.message}>{createGameMessage}</p>}
        </div>
    );
};

export default CreateGame;