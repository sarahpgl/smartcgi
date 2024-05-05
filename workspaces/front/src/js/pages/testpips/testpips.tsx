import React from 'react';
import Header from "@app/js/components/header/Header";
import SensibilisationQuizz from "@app/js/components/SensibilisationQuizz/SensibilisationQuizz";
import GameManager from '@app/js/components/Game/GameManager';
function PageTest(){
    return (
        <div>
            <GameManager />
            <SensibilisationQuizz>

            </SensibilisationQuizz>


        </div>
    )
}

export default PageTest;