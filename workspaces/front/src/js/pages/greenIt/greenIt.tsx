import React, { useState } from 'react';
import Header from "@app/js/components/header/Header";
import BookletFormation from "@app/js/components/BookletFormation/BookletFormation";
import RulesPage2 from "@app/js/components/RulesPage2/RulesPage2";
import next from '@app/icons/next.webp';
import styles from './greenIt.module.css';

function GreenIt() {
    const [page, setPage] = useState(1);

    const nextPage = () => {
        setPage(2);
    };

    const previousPage = () => {
        setPage(1);
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <label className={styles.label}>Mon carnet Green IT</label><br />
                <div className={styles.pageLeft}>
                    <BookletFormation />
                </div>
                <div className={styles.pageRight}>
                    <BookletFormation />
                </div>
                <div className={styles.navigationButtons}>
                    {(<img src={next} alt="Next" className={styles.nextButton} onClick={nextPage} />)}
                    {(<img src={next} alt="Previous" className={styles.prevButton} onClick={previousPage} />)}
                </div>
            </div>
        </div>
    );
}

export default GreenIt;
