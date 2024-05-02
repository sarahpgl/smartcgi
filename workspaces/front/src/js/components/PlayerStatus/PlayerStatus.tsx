import React, { useState } from 'react';

import styles from './PlayerStatus.module.css';
import { PlayerStateInterface, PublicPlayerState } from '@shared/common/Game';

import expertDev from '../../images/Expert_dev.webp';
import expertPO from '../../images/Expert_product_owner.webp';
import expertLT from '../../images/Expert_lead_tech.webp';

import bpDev from '../../images/MP_dev.webp';
import bpPO from '../../images/MP_product_owner.webp';
import bpLT from '../../images/MP_lead_tech.webp';

function PlayerStatus({ playerstate,me}: { playerstate: PlayerStateInterface ,  me: number}) {

    let name = "Pierre";
    let expert= playerstate.expertCards;
    let bp = playerstate.badPractice;
    let co2= playerstate.co2Saved;
    let sensibilisation = playerstate.sensibilisationPoints ;

    return (
        <div className={me === 1 ? styles.statusMe : styles.status}>
            <div className={me === 1 ? styles.container2Me : styles.container2}>
                <label className={styles.label}>{co2}</label><label className={styles.label} style={{ fontSize: '18px', letterSpacing: '0.2px' }}> kg</label> 
                <br/>
                {expert.map((e, index) => {
    let expertImageSrc = null;
    if (e === "Developer") {
        expertImageSrc = expertDev;
    } else if (e === "Architect") {
        expertImageSrc = expertLT;
    } else if (e === "ProductOwner") {
        expertImageSrc = expertPO;
    }
    return <img key={index} src={expertImageSrc} alt="Carte expert" className={styles.cardImage} />;
})}

                <br/>
                {bp!=="" && <img src={bpDev} alt="Carte BP" className={styles.cardImage} />}
                <br/>
                <label className={styles.labelPoints}>{sensibilisation>=1 ? "⬤" : "○"}</label>
                <label className={styles.labelPoints}>{sensibilisation>=2 ? "⬤" : "○"}</label>
                <label className={styles.labelPoints}>{sensibilisation>=3 ? "⬤" : "○"}</label>
                <label className={styles.labelPoints}>{sensibilisation>=4 ? "⬤" : "○"}</label>
                <label className={styles.labelPoints}>{sensibilisation>=5 ? "⬤" : "○"}</label>
                <label className={styles.labelPoints} style={{ fontSize: '4.2px', letterSpacing: '0.2px' }}> points de sensibilisation</label>
            </div>
        </div>
    );
}

export default PlayerStatus;
