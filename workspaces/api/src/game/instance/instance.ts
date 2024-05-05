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
import { BestPracticeAnswerType, BadPracticeAnswerType, PracticeAnswer, PracticeAnswerType, SensibilisationQuestionAnswer, SensibilisationQuestion } from '@shared/common/Game';
import { DrawMode } from './types';
import { Actor } from '@shared/common/Cards';
import { SensibilisationService } from '@app/sensibilisation/sensibilisation.service';

export class Instance {
  public co2Quantity: CO2Quantity;
  public playerStates: Record<string, PlayerState> = {};
  public cardDeck: Card[] = [];
  public discardPile: Card[] = [];
  public currentPlayerId: string;


  public gameStarted: boolean = false;
  private answerCount: number = 0;
  private currentSensibilisationQuestion: SensibilisationQuestion
  private startingPlayerId: string;

  public cardService: CardService;
  public sensibilisationService: SensibilisationService;

  constructor(
    private readonly lobby: Lobby,
    cardService: CardService,
    sensibilisationService: SensibilisationService
  ) {
    this.cardService = cardService;
    this.sensibilisationService = sensibilisationService;

  }

  public async triggerStart(): Promise<void> {

    this.cardDeck = await this.cardService.getDeck();

    this.lobby.clients.forEach((client) => {
      this.playerStates[client.gameData.clientInGameId] = new PlayerState(client.gameData.playerName, client.gameData.clientInGameId, this.co2Quantity);
      while (this.playerStates[client.gameData.clientInGameId].cardsInHand.length <= 6) {
        this.drawCard(this.playerStates[client.gameData.clientInGameId]);
      }
    });

    //Set the first player
    this.gameStarted = true;
    this.currentPlayerId = this.playerStates[Object.keys(this.playerStates)[0]].clientInGameId;
    this.startingPlayerId = this.currentPlayerId;
    this.currentSensibilisationQuestion = await this.sensibilisationService.getSensibilisationQuizz();
    this.lobby.dispatchGameStart(this.currentSensibilisationQuestion);
  }

  public triggerFinish(): void {

  }

  public discardCard(card: Card, client: AuthenticatedSocket) {
    const playerState = this.playerStates[client.gameData.clientInGameId];
    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, 'Player not found');
    }
    if (!playerState.canPlay) {
      throw new ServerException(SocketExceptions.GameError, 'You need to answer a sensibilisation question first');
    }
    playerState.cardsInHand = playerState.cardsInHand.filter((c) => c.id !== card.id);
    this.discardPile.push(card);
    this.drawCard(playerState);

    // On best or bad practice discard, ask the question
    if (card.cardType === 'BestPractice' || card.cardType === 'BadPractice') {
      this.answerCount = 0;
      this.lobby.dispatchPracticeQuestion(card, playerState.clientInGameId);
    }
    
  }

  public playCard(card: Card, client: AuthenticatedSocket): void {
    const playerState = this.playerStates[client.gameData.clientInGameId];
    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, 'Player not found');
    }

    if (this.currentPlayerId !== client.gameData.clientInGameId) {
      throw new ServerException(SocketExceptions.GameError, 'Not your turn');
    }

    if (!playerState.canPlay) {
      throw new ServerException(SocketExceptions.GameError, 'Player cannot play');
    }

    if (playerState.badPractice && card.cardType !== 'Formation' && card.cardType !== 'Expert' && card.actor !== playerState.badPractice) {
      throw new ServerException(SocketExceptions.GameError, 'Player must play a fitting formation or expert card');
    }

    playerState.cardsHistory.push(card);
    // TODO: Not working remove card from hand later
    playerState.cardsInHand = playerState.cardsInHand.filter((c) => c.id !== card.id);
    this.answerCount = 0;
    switch (card.cardType) {
      case 'BestPractice':
        this.playBestPractice(card, playerState);
        break;

      case 'Expert':
        this.playExpert(card, playerState);
        this.transitionToNextTurn();
        break;

      case 'BadPractice':
        this.playBadPractice(card, playerState);
        break;

      case 'Formation':
        this.playFormation(card, playerState);
        this.transitionToNextTurn();
      default:
        throw new ServerException(SocketExceptions.GameError, 'Invalid card type');
    }
    this.drawCard(playerState);
    this.lobby.dispatchGameState();
  }

  public answerBestPracticeQuestion(playerId: string, cardId: string, answer: PracticeAnswer): void {
    const playerState = this.playerStates[playerId];
    if (answer.answer !== BestPracticeAnswerType.APPLICABLE && answer.answer !== BestPracticeAnswerType.ALREADY_APPLICABLE && answer.answer !== BestPracticeAnswerType.NOT_APPLICABLE) {
      throw new ServerException(SocketExceptions.GameError, 'Invalid best practice answer type');
    }
    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, 'Player not found');
    }
    playerState.bestPracticeAnswers.push({ cardId, answer: answer.answer as BestPracticeAnswerType })
    this.answerCount++;
    if (this.answerCount === this.lobby.clients.size) {
      this.transitionToNextTurn();
    }
  }

  public answerBadPracticeQuestion(playerId: string, cardId: string, answer: PracticeAnswer): void {
    const playerState = this.playerStates[playerId];
    if (answer.answer !== BadPracticeAnswerType.TO_BE_BANNED && answer.answer !== BadPracticeAnswerType.ALREADY_BANNED && answer.answer !== BadPracticeAnswerType.TOO_COMPLEX) {
      throw new ServerException(SocketExceptions.GameError, 'Invalid bad practice answer type');
    }
    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, 'Player not found');
    }
    playerState.badPracticeAnswers.push({ cardId, answer: answer.answer as BadPracticeAnswerType })
    this.answerCount++;
    if (this.answerCount === this.lobby.clients.size) {
      this.transitionToNextTurn();
    }
  }

  public answerSensibilisationQuestion(playerId: string, answer: SensibilisationQuestionAnswer | null) {
    const playerState = this.playerStates[playerId];
    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, 'Player not found');
    }
    if (answer && this.currentSensibilisationQuestion.answers.answer === answer.answer) {
      if (!playerState.canPlay) {
        playerState.canPlay = true;
      }
      else {
        playerState.sensibilisationPoints++;
      }
    }
  }


  private playBestPractice(card: Best_Practice_Card, playerState: PlayerState) {
    playerState.co2Saved -= card.carbon_loss;
    this.answerCount = 0;
    this.lobby.dispatchPracticeQuestion(card, playerState.clientInGameId);
    this.lobby.dispatchGameState();
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
    this.lobby.dispatchGameState();
  }

  private playBadPractice(card: Bad_Practice_Card, playerState: PlayerState) {
    const target = card.targetedPlayerId;
    if (!target) {
      throw new ServerException(SocketExceptions.GameError, 'No target specified');
    }
    const targetPlayerState = this.playerStates[target];
    // check if the target is already blocked
    if (targetPlayerState.badPractice == null) {
      // check if the target has the expert card associated
      if (!targetPlayerState.expertCards.includes(card.actor)) {
        targetPlayerState.badPractice = card.actor;
        // Ask the question
        this.answerCount = 0;
        this.lobby.dispatchPracticeQuestion(card, playerState.clientInGameId);
        this.lobby.dispatchGameState();
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
    this.lobby.dispatchGameState();
  }

  private drawCard(playerState: PlayerState, drawMode: DrawMode = 'random') {
    if (this.cardDeck.length !== 0) {
      playerState.cardsInHand.push(this.cardDeck.pop());
    }
  }

  private async transitionToNextTurn() {
    this.currentPlayerId = Object.keys(this.playerStates)[(Object.keys(this.playerStates).indexOf(this.currentPlayerId) + 1) % Object.keys(this.playerStates).length];
    const playerState = this.playerStates[this.currentPlayerId];
    if( !playerState.canPlay){
      this.lobby.dispatchPlayerPassed(playerState.playerName);
      this.transitionToNextTurn();
    }
    if (this.currentPlayerId === this.startingPlayerId) {
      this.currentSensibilisationQuestion = await this.sensibilisationService.getSensibilisationQuizz();
      this.lobby.dispatchSensibilisationQuestion(this.currentSensibilisationQuestion);
    }
  }

}
