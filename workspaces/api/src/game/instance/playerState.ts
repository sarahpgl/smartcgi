import { Actor, Card } from "@shared/common/Cards";
import { PlayerStateInterface, PracticeAnswer, PublicPlayerState } from "@shared/common/Game";

export class PlayerState implements PlayerStateInterface {

  public badPractice: Actor | null = null;
  public canPlay: boolean = false;
  public cardsHistory: Card[] = [];
  public cardsInHand: Card[] = [];
  public co2Saved: number = 1000;
  public expertCards: Actor[] = [];
  public sensibilisationPoints: number = 0;
  public practiceAnswers: PracticeAnswer[] = [];

  public playerId: string;
  public playerName:string;

  constructor(playerName:string, playerId:string, co2Quantity:number){
    this.playerName = playerName;
    this.playerId = playerId;
    this.co2Saved = co2Quantity;
  }

  public getPublicState(): PublicPlayerState {
    return {
      playerId: this.playerId,
      canPlay: this.canPlay,
      cardsHistory: this.cardsHistory,
      playerName: this.playerName,
      co2Saved: this.co2Saved,
      sensibilisationPoints: this.sensibilisationPoints,
      badPractice: this.badPractice,
      expertCards: this.expertCards,
    }
  }

}