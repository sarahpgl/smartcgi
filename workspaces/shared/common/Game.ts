import { Card, Actor } from "./Cards";

export interface PlayerStateInterface {
  clientInGameId: string;
  playerName: string;
  co2Saved: number;
  canPlay: boolean;
  sensibilisationPoints: number;
  badPractice: Actor | null;
  expertCards: Actor[];
  cardsHistory: Card[];
  cardsInHand: Card[];
  practiceAnswers: PracticeAnswer[];
}

export interface PracticeAnswer {
  cardId: string;
  answer: PracticeAnswerType;
}

export enum PracticeAnswerType {
  APPLICABLE = 'applicable',
  NOT_APPLICABLE = 'not_applicable',
  UNKNOWN = 'unknown',
}


export interface GameState {
  currentPlayerId: string;
  playerStates: PlayerStateInterface[];
  discardPile: Card[];
};

export interface SensibilisationQuestion {
  question_id : number,
  question: string;
  answers: {
    response1 : string,
    response2 : string,
    response3 : string,
    answer : number
  }
};

  export interface SensibilisationQuestionAnswer {
    answer : number
  };


