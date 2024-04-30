import { PlayerStateInterface, PublicPlayerState } from '@shared/common/Game';
import { ServerEvents } from './ServerEvents';
import { Card, CardType } from '@shared/common/Cards';

export type ServerPayloads = {
  [ServerEvents.Pong]: {
    message: string;
  };

  [ServerEvents.LobbyState]: {
    lobbyId: string;
    connectionCode: string;
    co2Quantity: number;
    ownerName: string;
    clientsNames: string[];
  };

  [ServerEvents.GameState]: {
    currentPlayer: string;
    playerStates: PlayerStateInterface[];
    discardPile: Card[];
  };

  [ServerEvents.SensibilisationQuestion]: {
    question: string;
    answers: {
      [key: string]: string;
    };
  };

  [ServerEvents.PracticeQuestion]: {
    playerName: string;
    cardType: CardType;
  };
};


