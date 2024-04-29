import React, { useState } from 'react';
import '../../../CSS/App.css';
//import styles from './RegisterForm.module.css';
import styles from './RegisterForm.module.css';


const RegisterForm = ({ onSuccessfulRegistration }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      // Effectuez ici votre action de soumission du formulaire
      setErrorMessage('');
      // Réinitialisez les champs de formulaire
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Basculez vers le formulaire de connexion
      onSuccessfulRegistration();
    } else {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      {openSnackbar && (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', position: 'fixed', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
          {errorMessage}
          <button onClick={handleSnackbarClose} style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Fermer</button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="inputContainerRegisterForm"> 
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="inputContainerRegisterForm">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        </div>
        <div className="inputContainerRegisterForm">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmation du mot de passe"
            required
          />
        </div>
        <div>
          <button className={styles.buttonregister} type="submit">S'inscrire</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;



