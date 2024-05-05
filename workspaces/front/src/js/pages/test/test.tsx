import React from 'react';
import Header from "@app/js/components/header/Header";
import EndGameSummary from '@app/js/components/EndGameSummary/EndGameSummary';
import MyEndGameSummary from '@app/js/components/MyEndGameSummary/MyEndGameSummary';
function PageTest(){
    return (
        <div>
        <Header />
        <EndGameSummary />
        <MyEndGameSummary />
        </div>
    )
}

export default PageTest;