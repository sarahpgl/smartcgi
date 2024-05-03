import { Lobby } from '@app/game/lobby/lobby';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import { SECOND } from '@app/game/constants';
import { Socket } from 'socket.io';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Card, Best_Practice_Card, Bad_Practice_Card, Expert_Card, Formation_Card } from '@shared/common/Cards';
import { CO2Quantity } from '@app/game/lobby/types';
import { PlayerState } from '@app/game/instance/playerState';
import { Inject } from '@nestjs/common';
import { CardService } from '@app/card/card.service';
import { PracticeAnswerType, SensibilisationQuestion, SensibilisationQuestionAnswer } from '@shared/common/Game';
import { DrawMode } from './types';
import { Actor } from '@shared/common/Cards';
import { SensibilisationService } from '@app/sensibilisation/sensibilisation.service';
import { Question_Content } from '@app/entity/question_content';

export class Instance {
  public co2Quantity: CO2Quantity;
  public playerStates: Record<string, PlayerState> = {};
  public cardDeck: Card[] = [];
  public discardPile: Card[] = [];
  public currentPlayerId: string;
  public players: string[] = [];
  public sensibilisationQuestions: SensibilisationQuestion[] = [];

  public gameStarted: boolean = false;
  private answerCount: number = 0;

  constructor(
    private readonly lobby: Lobby,
    private readonly cardService: CardService,
    private readonly sensibilisationService : SensibilisationService
  ) {
  }

  public async triggerStart(): Promise<void> {
    this.cardDeck = await this.cardService.getDeck();
    // TODO: Implement this service in Sensibilisation Module
    // this.sensibilisationQuestions = await this.sensibilisationService.getQuestions();
    this.lobby.clients.forEach((client) => {
      //console.log('CO2', this.co2Quantity);
      this.playerStates[client.id] = new PlayerState(client.gameData.playerName, client.gameData.clientInGameId, this.co2Quantity);
      while (this.playerStates[client.id].cardsInHand.length <= 6) {
        this.drawCard(this.playerStates[client.id]);
      }
    });

    //Set the first player
    this.gameStarted = true;
    this.currentPlayerId = this.players[0];
    const question: SensibilisationQuestion = (await this.SensibilisationQuizz()).content;
    this.lobby.dispatchGameStart(question);
  }

  public triggerFinish(): void {
  }

  public playCard(card: Card, client: AuthenticatedSocket) {
    const playerState = this.playerStates[client.id];

    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, 'Player not found');
    }

    if (!playerState.canPlay) {
      throw new ServerException(SocketExceptions.GameError, 'Player cannot play');
    }

    if (playerState.badPractice && card.cardType !== 'Formation' && card.cardType !== 'Expert' && card.actor !== playerState.badPractice) {
      throw new ServerException(SocketExceptions.GameError, 'Player must play a fitting formation or expert card');
    }

    playerState.cardsHistory.push(card);
    playerState.cardsInHand = playerState.cardsInHand.filter((c) => c !== card);
    switch (card.cardType) {
      case 'BestPractice':
        this.playBestPractice(card, playerState);
        break;

      case 'Expert':
        this.playExpert(card, playerState);
        break;

      case 'BadPractice':
        this.playBadPractice(card, playerState);
        break;

      case 'Formation':
        this.playFormation(card, playerState);

      default:
        throw new ServerException(SocketExceptions.GameError, 'Invalid card type');
    }
    this.drawCard(playerState);
    this.currentPlayerId = Object.keys(this.playerStates)[(Object.keys(this.playerStates).indexOf(this.currentPlayerId) + 1) % Object.keys(this.playerStates).length];
  }

  public answerPracticeQuestion(playerId: string, cardId: string, answer: PracticeAnswerType): void {
    const playerState = this.playerStates[playerId];

    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, 'Player not found');
    }
    playerState.practiceAnswers.push({ cardId, answer })
    this.answerCount++;
    if (this.answerCount === this.lobby.clients.size) {
      this.lobby.dispatchGameState();
    }
  }
 
  public async SensibilisationQuizz(): Promise<{ content: SensibilisationQuestion }> {
    const questionsData = await this.sensibilisationService.getSensibilisationQuizz();
    const sensibilisationQuestion: SensibilisationQuestion = questionsData.questions;
    this.lobby.dispatchSensibilisationQuestion(sensibilisationQuestion);
    return { content: sensibilisationQuestion };
}

  public answerSensibilisationQuestion(playerId: string, questionId: number, answer: SensibilisationQuestionAnswer): Promise<{trial :boolean }> {
    let response = false;
    const playerState = this.playerStates[playerId];

    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, 'Player not found');
    }
    let solution = this.sensibilisationService.getGoodSolution(questionId);
    if( solution[0] == answer.answer){
      response = true;
      if(!this.playerStates.canPlay){
        this.playerStates.canPlay.canPlay = true;
      }
      this.playerStates.sensibilisationPoints.sensibilisationPoints ++;
    }
    return Promise.resolve({ trial: response });
  }


  private playBestPractice(card: Best_Practice_Card, playerState: PlayerState) {
    //Ajouter le CO2
    playerState.co2Saved -= card.carbon_loss;
    //Poser la question
    this.answerCount = 0;
    this.lobby.dispatchPracticeQuestion(card, playerState.clientInGameId);
  }

  private playExpert(card: Expert_Card, playerState: PlayerState) {
    const actor = card.actor;
    // add the expert card to the player
    playerState.expertCards.push(actor);
    // remove the bad practice card if the player has it
    if (playerState.badPractice == actor) {
      playerState.badPractice = null;
    }
    this.lobby.dispatchCardPlayed(card, playerState.clientInGameId);
  }

  private playBadPractice(card: Bad_Practice_Card, playerState: PlayerState) {
    const target = card.targetedPlayerId;
    const targetPlayerState = this.playerStates[target];
    // check if the target is already blocked
    if (targetPlayerState.badPractice == null) {
      // check if the target has the expert card associated
      if (!targetPlayerState.expertCards.includes(card.actor)) {
        targetPlayerState.badPractice = card.actor;
        // Ask the question
        this.answerCount = 0;
        this.lobby.dispatchPracticeQuestion(card, playerState.clientInGameId);
      } else {
        throw new ServerException(SocketExceptions.GameError, 'Player has the expert card associated');
      }
    } else {
      throw new ServerException(SocketExceptions.GameError, 'Player already targeted by a bad practice card');
    }
  }


  private playFormation(card: Formation_Card, playerState: PlayerState) {
    const actor = card.actor;
    // remove the bad practice card if the player has it
    if (playerState.badPractice == actor) {
      playerState.badPractice = null;
    }
    this.lobby.dispatchCardPlayed(card, playerState.clientInGameId);
  }

  private drawCard(playerState: PlayerState, drawMode: DrawMode = 'random') {
    if (this.cardDeck.length !== 0) {
      playerState.cardsInHand.push(this.cardDeck.pop());
    }
  }

  private transitionToNextRound(): void {

  }

}
