import React from 'react';
import Header from "@app/js/components/header/Header";
import Lobby from '@app/js/components/Lobby/Lobby';
import JoinGameC from '@app/js/components/JoinGame/JoinGame';
function JoinGame(){
    return (
        <div>
        <Header />
        <JoinGameC />
        </div>
    )
}

export default JoinGame;