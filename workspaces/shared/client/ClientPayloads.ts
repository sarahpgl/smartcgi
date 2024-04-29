import { PracticeAnswerType } from '@shared/common/Game';
import { ClientEvents } from './ClientEvents';

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
  
  }

  [ClientEvents.PracticeQuestion]: {
    cardId: string;
    answer: PracticeAnswerType;
  }
};