import React from 'react';

const Header = () => {
  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>Mon Application</h1>
    </header>
  );
};

// Styles CSS en ligne pour l'en-tête et le titre
const headerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  width: '100%', // Prend toute la largeur de la page
};

const titleStyle = {
  fontSize: '1.5rem',
  margin: '0',
};

export default Header;
