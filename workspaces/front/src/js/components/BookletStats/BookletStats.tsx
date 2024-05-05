import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookletStats.module.css';

const BookletStats: React.FC = () => {
    const data = {
        nb_played: 37,
        nb_win: 8,
        percent_win:21.62,
        total_CO2: 18.7,
        nb_BP: 59,
        nb_MP: 8
    };

    const navigate = useNavigate();


    return (
        <div className={styles.container}>
            <label className={styles.label}><strong>Statistiques du jeu</strong></label><br />
            <p>
                    Nombre de parties jouées : {data.nb_played}<br /><br />
                    Nombre de victoires : {data.nb_win} ({data.percent_win}%)<br /><br />
                    Total de CO2 économisé : {data.total_CO2} T<br /><br />
                    Nombre de bonnes pratiques archivées dans le carnet : {data.nb_BP}<br /><br />
                    Nombre de mauvaises pratiques archivées dans le carnet : {data.nb_MP}<br /><br />
                </p>
        </div>
    );
};

export default BookletStats;
