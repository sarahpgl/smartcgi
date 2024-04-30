import React, { useState } from 'react';
import './Header.css';
import initiative_CGI from '../../images/initiative-CGI.png';
import tonne_de_bonnes_pratiques from '../../images/1_tonne_de_bonnes_pratiques.png';
import drapeau_fr from '../../images/drapeau_fr.webp';
import drapeau_en from '../../images/drapeau_en.webp';

function Header() {
    const [langue, setLangue] = useState('fr');
    
    const changerLangue = () => {
        setLangue(langue === 'fr' ? 'en' : 'fr');
    };

    return (
        <header className="header">
            <div className="left" onClick={changerLangue}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={langue === 'fr' ? drapeau_fr : drapeau_en} alt="Drapeau" />
                    <span>{langue === 'fr' ? 'Français' : 'English'}</span>
                </div>
            </div>
            <div className="center">
                <img src={tonne_de_bonnes_pratiques} alt="1T_Bonnes_Pratiques" style={{ height: 150 }} />
            </div>
            <div className="right">
                <img src={initiative_CGI} alt="Initiative_CGI" />
            </div>
        </header>
    );
}

export default Header;
