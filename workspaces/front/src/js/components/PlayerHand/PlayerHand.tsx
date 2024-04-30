import React, { useState } from 'react';

import styles from './PlayerHand.module.css';

import BestPracticeCard from '@app/js/components/BestPracticeCard/BestPracticeCard';
import BadPracticeCard from '../BadPracticeCard/BadPracticeCard';
import ExpertCard from '../ExpertCard/ExpertCard';
import FormationCard from '../FormationCard/FormationCard';

function PlayerHand() {

    return (

            <div className={styles.hand}>
                <BestPracticeCard />
                <ExpertCard />
                <BestPracticeCard />
                <BadPracticeCard />
                <ExpertCard cardType={'Expert'} id={'32'} actor={'ProductOwner'} title={'Coucou'} contents={'blabla blabla blabla blabla blabla blabla blabla blabla blabla '} />
                <FormationCard cardType={'Formation'} id={'32'} actor={'ProductOwner'} title={'Titre de la carte'} contents={'blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla blabla '} />
                <BestPracticeCard cardType={'BestPractice'} id={'32'} title={'Titre de la carte'} contents={'blabla blabla blabla blabla blabla blabla blabla blabla blabla '} carbon_loss={50} />
            </div>

    );
}

export default PlayerHand;
