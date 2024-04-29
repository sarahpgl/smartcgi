import ConnexionForm from "@app/js/components/connexionForm/connexionForm";
import React, { useState } from 'react';

import RegisterForm from "@app/js/components/RegisterForm/RegisterForm";
import HeaderTempo from "@app/js/components/HeaderTempo";
import styles from './register.module.css';
import image from '../../../icons/Image_welcome.svg';


const RegisterPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const handleSuccessfulRegistration = () => {
    setShowLoginForm(true); // Revenir au formulaire de connexion après une inscription réussie
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
            <img src={image} alt="Image de la tonne de bonnes pratiques" height={1000}} />
        </div>
        <div className={styles.formContainer}>
          {showLoginForm ? (
            <ConnexionForm onShowRegisterForm={() => setShowLoginForm(false)} />
          ) : (
            <RegisterForm onSuccessfulRegistration={handleSuccessfulRegistration} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
