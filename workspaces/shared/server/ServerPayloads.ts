import { GameState, SensibilisationQuestion } from '../common/Game';
import { ServerEvents } from './ServerEvents';
import { Card, CardType } from '../common/Cards';
import { Question_Content } from '@app/entity/question_content';

export type ServerPayloads = {
  [ServerEvents.Pong]: {
    message: string;
  };

  [ServerEvents.LobbyJoined]: {
    clientInGameId: string;
  }

  [ServerEvents.LobbyState]: {
    lobbyId: string;
    connectionCode: string;
    co2Quantity: number;
    ownerId: string;
    // A Record from id to playerName
    clientsNames: Record<string, string>;
  };

  [ServerEvents.GameStart]: {
    gameState: GameState;
    sensibilisationQuestion: SensibilisationQuestion;
  };

  [ServerEvents.GameState]: GameState;



  [ServerEvents.PracticeQuestion]: {
    playerId: string;
    card: Card;
  };

  [ServerEvents.CardPlayed]: {
    playerId: string;
    cardType: CardType;
    gameState: GameState;
  };
  
  [ServerEvents.GetSensibilisationQuestion] : {
    question_id : number,
    question: string;
    answers: {
      response1 : string,
      response2 : string,
      response3 : string,
      answer : number
    }
  };
};


