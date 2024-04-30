import React, { useState } from 'react';
import styles from './connexionForm.module.css';
import { useNavigate } from "react-router-dom";



const ConnexionForm = ({ onShowRegisterForm }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    /*const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/menu');
        console.log(formData);
    };*/

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/menu');
            } else {
                // Gérer les erreurs de connexion
                console.error('Erreur de connexion:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur de connexion:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email"></label>
                <input className={styles.input}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="e-mail"
                    value={formData.email}
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
