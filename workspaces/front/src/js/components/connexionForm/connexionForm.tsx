
import React, { useState } from 'react';
import styles from './ConnexionForm.module.css';

const ConnexionForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log(formData);
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
                <button className={styles.buttonregister} type="submit">S'inscrire</button>
            </div>
        </form>
    );
};

export default ConnexionForm;
