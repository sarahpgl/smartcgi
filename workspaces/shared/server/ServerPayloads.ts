import { GameState, SensibilisationQuestion } from '../common/Game';
import { ServerEvents } from './ServerEvents';
import { Card, CardType } from '../common/Cards';

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

  [ServerEvents.GameStart]: {
    gameState: GameState;
    sensibilisationQuestion: SensibilisationQuestion;
  };

  [ServerEvents.GameState]: GameState;

  [ServerEvents.SensibilisationQuestion]: SensibilisationQuestion;

  [ServerEvents.PracticeQuestion]: {
    playerName: string;
    cardType: CardType;
  };
};


