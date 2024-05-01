import React, { useState } from 'react';

import styles from './PlayerInGameHistory.module.css';

import BestPracticeCard from '@app/js/components/BestPracticeCard/BestPracticeCard';
import BadPracticeCard from '../BadPracticeCard/BadPracticeCard';
import ExpertCard from '../ExpertCard/ExpertCard';
import FormationCard from '../FormationCard/FormationCard';

function PlayerInGameHistory() {

    return (

            <div className={styles.hand}>
                <ExpertCard cardType={'Expert'} id={'32'} actor={'ProductOwner'} title={'Coucou'} contents={'blabla blabla blabla blabla blabla blabla blabla blabla blabla '} />
                <FormationCard cardType={'Formation'} id={'32'} actor={'ProductOwner'} title={'Titre de la carte'} contents={'blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla '} />
                <BestPracticeCard cardType={'BestPractice'} id={'32'} title={'Titre de la carte'} contents={'blabla blabla blabla blabla blabla blabla blabla blabla blabla '} carbon_loss={50} />
            </div>

    );
}

export default PlayerInGameHistory;
