import React, { useState } from 'react';
import styles from './connexionForm.module.css';
import { useNavigate } from "react-router-dom";


const ConnexionForm = ({ onShowRegisterForm }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        mail: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/menu');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Une erreur s\'est produite lors de la connexion.');
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error('Erreur de connexion:', error.message);
            setErrorMessage('Une erreur s\'est produite lors de la connexion.');
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            {openSnackbar && (
                <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', position: 'fixed', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
                    {errorMessage}
                    <button onClick={handleSnackbarClose} style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Fermer</button>
                </div>
            )}
            <div>
                <label htmlFor="email"></label>
                <input className={styles.input}
                    type="email"
                    id="email"
                    name="mail"
                    placeholder="e-mail"
                    value={formData.mail}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="password"></label>
                <input className={styles.input}
                    type="password"
                    id="password"
                    name="password"
                    placeholder="mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>
            <button className={styles.button} type="submit">Connexion</button>
            <div>
                <label className={styles.label} >Pas de compte ?</label>
            </div>
            <div>
                <button onClick={onShowRegisterForm} className={styles.buttonregister}>S'inscrire</button>
            </div>
        </form>
    );
};

export default ConnexionForm;
