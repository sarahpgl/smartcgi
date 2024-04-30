import { Card, Actor } from "./Cards";

export interface PublicPlayerState {
  playerId: string;
  playerName: string;
  co2Saved: number;
  canPlay: boolean;
  sensibilisationPoints: number;
  badPractice: Actor | null;
  expertCards: Actor[];
  cardsHistory: Card[];
}
export interface PlayerStateInterface extends PublicPlayerState {
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


