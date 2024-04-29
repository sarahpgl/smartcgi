import ConnexionForm from "@app/js/components/ConnexionForm/connexionForm";
import React, { useState } from 'react';

import RegisterForm from "@app/js/components/RegisterForm/RegisterForm";
import Header from "@app/js/components/header/Header";
import styles from './register.module.css';
import image from '../../../icons/Image_welcome.svg';

const RegisterPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  const handleSuccessfulRegistration = () => {
    setShowLoginForm(true); // Revenir au formulaire de connexion après une inscription réussie
  };

  return (
    <div className={styles.registerPage}>
      <Header />
      <div className={styles.content}>
        <img src={image} alt="Image de la tonne de bonnes pratiques" className={styles.image} />
        <div className={styles.formContainer}>
          <div className={styles.forms}>
            {showLoginForm ? (
              <ConnexionForm onShowRegisterForm={() => setShowLoginForm(false)} />
            ) : (
              <RegisterForm onSuccessfulRegistration={handleSuccessfulRegistration} />
            )}
          </div>
        </div>
      </div>
    </div>
  );  
};

export default RegisterPage;
