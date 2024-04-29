import React from 'react';
import HeaderTempo from '@app/js/components/HeaderTempo/HeaderTempo';
import Lobby from '@app/js/components/Lobby/Lobby';
import JoinGameC from '@app/js/components/JoinGame/JoinGame';
function JoinGame(){
    return (
        <div>
        <HeaderTempo />
        <JoinGameC />
        </div>
    )
}

export default JoinGame;