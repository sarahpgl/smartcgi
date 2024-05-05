import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookletFormation.module.css';
import BestPracticeCard from "@app/js/components/BestPracticeCard/BestPracticeCard";
import BadPracticeCard from "@app/js/components/BadPracticeCard/BadPracticeCard";

const BookletFormation: React.FC = () => {
    const data = {
        lien1: "https://gr491.isit-europe.org/",
        lien2: "https://eco-conception.designersethiques.org/guide/fr/",
        lien3: "https://collectif.greenit.fr/ecoconception-web/",
    };

    const navigate = useNavigate();


    return (
        <div className={styles.container}>
            <label className={styles.label}>Guide et formations</label><br />
        </div>
    );
};

export default BookletFormation;
