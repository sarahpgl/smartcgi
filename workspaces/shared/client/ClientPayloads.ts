import { PracticeAnswer } from '../common/Game';
import { ClientEvents } from './ClientEvents';
import { Card } from '../common/Cards';

export type ClientPayloads = {
  [ClientEvents.Ping]: {
    message: string;
  };

  [ClientEvents.LobbyCreate]: {
    playerName: string;
    co2Quantity: number;
  }

  [ClientEvents.LobbyJoin]: {
    connectionCode: string;
    playerName: string;
  }

  [ClientEvents.LobbyLeave]: {

  }

  [ClientEvents.LobbyStartGame]: {
    clientInGameId: string;
  }

  [ClientEvents.AnswerPracticeQuestion]: {
    cardId: string;
    answer: PracticeAnswer;
  }

  [ClientEvents.PlayCard]: {
    card: Card;
  }

  [ClientEvents.ClientReconnect]: {
    clientInGameId: string;
  }
};
