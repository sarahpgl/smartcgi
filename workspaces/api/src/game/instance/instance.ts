import { Lobby } from '@app/game/lobby/lobby';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { Card, Best_Practice_Card, Bad_Practice_Card, Expert_Card, Formation_Card } from '@shared/common/Cards';
import { CO2Quantity } from '@app/game/lobby/types';
import { PlayerState } from '@app/game/instance/playerState';
import { CardService } from '@app/card/card.service';
import { BestPracticeAnswerType, BadPracticeAnswerType, PracticeAnswerType, SensibilisationQuestionAnswer, SensibilisationQuestion } from '@shared/common/Game';
import { DrawMode } from './types';
import { SensibilisationService } from '@app/sensibilisation/sensibilisation.service';
import { GameService } from '../game.service';

export class Instance {
  public co2Quantity: CO2Quantity;
  public playerStates: Record<string, PlayerState> = {};
  public cardDeck: Card[] = [];
  public discardPile: Card[] = [];

  public currentPlayerId: string;
  private startingPlayerId: string;

  public gameStarted: boolean = false;
  private winningPlayer: string | null = null;
  private answerCount: number = 0;
  private currentSensibilisationQuestion: SensibilisationQuestion | null = null;

  public cardService: CardService;
  public sensibilisationService: SensibilisationService;
  public gameService: GameService;


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
        this.drawCard(this.playerStates[client.gameData.clientInGameId], 'random');
      }
    });

    //Set the first player
    this.gameStarted = true;
    this.currentPlayerId = this.playerStates[Object.keys(this.playerStates)[0]].clientInGameId;
    this.startingPlayerId = this.currentPlayerId;
    this.currentSensibilisationQuestion = await this.sensibilisationService.getSensibilisationQuizz();
    this.lobby.dispatchGameStart(this.currentSensibilisationQuestion);
  }

  public async triggerFinish(winnerId: string, winnerName: string): Promise<void> {
    // TODO: Implement the save to Database
    // this.saveToDatabase(winnerId);

    this.cardDeck = await this.cardService.getDeck();
    const mostPopularCards: Card[] = this.generateGeneralGameReport();
    Object.keys(this.playerStates).forEach((playerId) => {
      const myArchivedCards = this.generatePersonalGameReport(playerId);
      this.lobby.emitGameReport({ myArchivedCards, mostPopularCards }, playerId, winnerName);
    });

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

    // Dispatch a card has been discarded
    this.answerCount = 0;
    this.lobby.dispatchCardPlayed(card, playerState.clientInGameId, playerState.playerName, true);
    if (card.cardType === 'Expert' || card.cardType === 'Formation') {
      if (this.playerStates[this.currentPlayerId].sensibilisationPoints > 0) {
        this.askDrawModeChoice();
      }
      else {
        this.transitionToNextTurn('random');
      }
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
    playerState.cardsInHand = playerState.cardsInHand.filter((c) => c.id !== card.id);
    this.answerCount = 0;
    this.lobby.dispatchCardPlayed(card, playerState.clientInGameId, playerState.playerName, false);
    switch (card.cardType) {
      case 'BestPractice':
        this.playBestPractice(card, playerState);
        break;

      case 'Expert':
        this.playExpert(card, playerState);
        if (playerState.sensibilisationPoints > 0) {
          this.askDrawModeChoice();
        } else {
          this.transitionToNextTurn('random');
        }
        break;

      case 'BadPractice':
        this.playBadPractice(card, playerState);
        break;

      case 'Formation':
        this.playFormation(card, playerState);
        if (playerState.sensibilisationPoints > 0) {
          this.askDrawModeChoice();
        } else {
          this.transitionToNextTurn('random');
        }
        break;
      default:
        throw new ServerException(SocketExceptions.GameError, 'Invalid card type');
    }
  }

  public answerBestPracticeQuestion(playerId: string, cardId: string, answer: PracticeAnswerType): void {
    const playerState = this.playerStates[playerId];
    if (answer !== BestPracticeAnswerType.APPLICABLE && answer !== BestPracticeAnswerType.ALREADY_APPLICABLE && answer !== BestPracticeAnswerType.NOT_APPLICABLE) {
      throw new ServerException(SocketExceptions.GameError, 'Invalid best practice answer type');
    }
    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, 'Player not found');
    }
    playerState.bestPracticeAnswers.push({ cardId, answer: answer as BestPracticeAnswerType })
    this.answerCount++;
    if (this.answerCount === this.lobby.clients.size) {
      if (this.winningPlayer !== null) {
        this.triggerFinish(this.winningPlayer, playerState.playerName);
      }
      this.currentSensibilisationQuestion = null;
      this.lobby.dispatchPracticeAnswered();
      if (this.playerStates[this.currentPlayerId].sensibilisationPoints > 0) {
        this.askDrawModeChoice();
      } else {
        this.transitionToNextTurn('random');
      }
    }
  }

  public answerBadPracticeQuestion(playerId: string, cardId: string, answer: PracticeAnswerType): void {
    const playerState = this.playerStates[playerId];
    if (answer !== BadPracticeAnswerType.TO_BE_BANNED && answer !== BadPracticeAnswerType.ALREADY_BANNED && answer !== BadPracticeAnswerType.TOO_COMPLEX) {
      throw new ServerException(SocketExceptions.GameError, 'Invalid bad practice answer type');
    }
    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, 'Player not found');
    }
    playerState.badPracticeAnswers.push({ cardId, answer: answer as BadPracticeAnswerType })
    this.answerCount++;
    if (this.answerCount === this.lobby.clients.size) {
      this.lobby.dispatchPracticeAnswered();
      if (this.playerStates[this.currentPlayerId].sensibilisationPoints > 0) {
        this.askDrawModeChoice();
      } else {
        this.transitionToNextTurn('random');
      }

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
    this.answerCount++;
    if (this.answerCount === this.lobby.clients.size) {
      this.currentSensibilisationQuestion = null;
      this.lobby.dispatchSensibilisationAnswered();
      this.lobby.dispatchGameState();
      if (!this.playerStates[this.currentPlayerId].canPlay) {
        this.transitionToNextTurn('random');
      }
    }
  }

  public ReceptDrawModeChoice(drawMode: DrawMode) {
    this.transitionToNextTurn(drawMode);
  }

  private playBestPractice(card: Best_Practice_Card, playerState: PlayerState) {
    playerState.co2Saved -= card.carbon_loss;
    this.answerCount = 0;
    this.lobby.dispatchGameState();
    if (playerState.co2Saved <= 0) {
      this.winningPlayer = playerState.clientInGameId;
    }
  }

  private playExpert(card: Expert_Card, playerState: PlayerState) {
    const actor = card.actor;
    // add the expert card to the player
    playerState.expertCards.push(actor);
    // remove the bad practice card if the player has it
    if (playerState.badPractice == actor) {
      playerState.badPractice = null;
    }
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
  }

  private drawCard(playerState: PlayerState, drawMode: DrawMode) {
    if (this.cardDeck.length !== 0) {
      if (drawMode === 'random') {
        playerState.cardsInHand.push(this.cardDeck.pop());
      } else if (drawMode === 'randomFormation') {
        const formationCards = this.cardDeck.filter(card => card.cardType === 'Formation');
        if (formationCards.length > 0) {
          const randomIndex = Math.floor(Math.random() * formationCards.length);
          const card = formationCards[randomIndex];
          playerState.cardsInHand.push(card);
          this.cardDeck.splice(this.cardDeck.indexOf(card), 1);
          playerState.sensibilisationPoints = playerState.sensibilisationPoints - 1;
        } else {
          playerState.cardsInHand.push(this.cardDeck.pop());
          throw new ServerException(SocketExceptions.GameError, 'No formation card left in the deck');
        }
      } else if (drawMode === 'goodFormation') {
        const badActor = playerState.badPractice;
        const formationCard = this.cardDeck.filter(card => card.cardType === 'Formation' && card.actor == badActor);
        if (formationCard.length > 0) {
          const card = formationCard[0];
          playerState.cardsInHand.push(card);
          this.cardDeck.splice(this.cardDeck.indexOf(card), 1);
          playerState.sensibilisationPoints = playerState.sensibilisationPoints - 3;
        } else {
          playerState.cardsInHand.push(this.cardDeck.pop());
          throw new ServerException(SocketExceptions.GameError, 'Not this formation card left in the deck');
        }
      } else if (drawMode === 'expert') {
        const expertCards = this.cardDeck.filter(card => card.cardType === 'Expert');
        if (expertCards.length > 0) {
          const randomIndex = Math.floor(Math.random() * expertCards.length);
          const card = expertCards[randomIndex];
          playerState.cardsInHand.push(card);
          this.cardDeck.splice(this.cardDeck.indexOf(card), 1);
          playerState.sensibilisationPoints = playerState.sensibilisationPoints - 5;
        } else {
          playerState.cardsInHand.push(this.cardDeck.pop());
          throw new ServerException(SocketExceptions.GameError, 'No expert card left in the deck');
        }
      }

    }
  }

  private askDrawModeChoice() {
    const isBlocked: boolean = (this.playerStates[this.currentPlayerId].badPractice == null) ? false : true;
    const formationCards = this.cardDeck.filter(card => card.cardType === 'Formation');
    let formationCardLeft: boolean = true;
    if (formationCards.length === 0) {
      formationCardLeft = false;
    }
    const ExpertCards = this.cardDeck.filter(card => card.cardType === 'Expert');
    let expertCardLeft: boolean = true;
    if (ExpertCards.length === 0) {
      expertCardLeft = false;
    }
    this.lobby.emitUseSensibilisationPoints(this.playerStates[this.currentPlayerId].sensibilisationPoints, this.currentPlayerId, isBlocked, formationCardLeft, expertCardLeft);

  }
  private async transitionToNextTurn(draw_mode: DrawMode) {
    // 0: Draw a card for the current player
    if (this.playerStates[this.currentPlayerId].cardsInHand.length <= 6) {
      this.drawCard(this.playerStates[this.currentPlayerId], draw_mode);
    }
    // 1: Change the current player
    this.currentPlayerId = Object.keys(this.playerStates)[(Object.keys(this.playerStates).indexOf(this.currentPlayerId) + 1) % Object.keys(this.playerStates).length];

    // 2: Dispatch Game State
    this.lobby.dispatchGameState();
    const playerState = this.playerStates[this.currentPlayerId];

    // 3: If all players have played, ask a sensibilisation question
    if (this.currentPlayerId === this.startingPlayerId) {
      this.answerCount = 0;
      this.currentSensibilisationQuestion = await this.sensibilisationService.getSensibilisationQuizz();
      this.lobby.dispatchSensibilisationQuestion(this.currentSensibilisationQuestion);
    }

    // 4: Check if player has already answered a practice question
    if (!playerState.canPlay && this.currentSensibilisationQuestion === null) {
      this.lobby.dispatchPlayerPassed(playerState.playerName);
      this.transitionToNextTurn('random');
    }

  }

  private generatePersonalGameReport(clientInGameId: string): Card[] {
    const myArchivedCards: Card[] = [];
    const bestPracticeAnswers = this.playerStates[clientInGameId].bestPracticeAnswers;
    for (const answer of bestPracticeAnswers) {
      if (answer.answer === BestPracticeAnswerType.APPLICABLE) {
        const card = this.cardDeck.find((card) => card.id === answer.cardId);
        if (!card) {
          throw new ServerException(SocketExceptions.GameError, 'Card not found');
        }
        myArchivedCards.push(card);
      }
    }

    const badPracticeAnswers = this.playerStates[clientInGameId].badPracticeAnswers;
    for (const answer of badPracticeAnswers) {
      if (answer.answer === BadPracticeAnswerType.TO_BE_BANNED) {
        const card = this.cardDeck.find((card) => card.id === answer.cardId);
        if (!card) {
          throw new ServerException(SocketExceptions.GameError, 'Card not found');
        }
        myArchivedCards.push(card);
      }
    }
    return myArchivedCards;
  }

  private generateGeneralGameReport(): Card[] {

    const mostPopularCards: Card[] = [];
    const popularBestPracticeCards: { [key: string]: number } = {};
    const popularBadPracticeCards: { [key: string]: number } = {};

    const playerIds = Object.keys(this.playerStates);
    for (let init = 0; init < playerIds.length; init++) {
      const historyBestPracticeByPlayer = this.playerStates[playerIds[init]].bestPracticeAnswers;
      for (const answer of historyBestPracticeByPlayer) {
        if (answer.answer === BestPracticeAnswerType.APPLICABLE) {
          const bestPracticeCard = this.cardDeck.find((bestPracticeCard) => bestPracticeCard.id === answer.cardId);
          if (!bestPracticeCard) {
            throw new ServerException(SocketExceptions.GameError, 'Card not found');
          }
          if (bestPracticeCard.id in popularBestPracticeCards) {
            popularBestPracticeCards[bestPracticeCard.id] += 1;
          } else {
            popularBestPracticeCards[bestPracticeCard.id] = 1;
          }
        }
      }
      const historyBadPracticeByPlayer = this.playerStates[playerIds[init]].badPracticeAnswers;
      for (const answer of historyBadPracticeByPlayer) {
        if (answer.answer === BadPracticeAnswerType.TO_BE_BANNED) {
          const badPracticeCard = this.cardDeck.find((badPracticeCard) => badPracticeCard.id === answer.cardId);
          if (!badPracticeCard) {
            throw new ServerException(SocketExceptions.GameError, 'Card not found');
          }
          if (badPracticeCard.id in popularBadPracticeCards) {
            popularBadPracticeCards[badPracticeCard.id] += 1;
          } else {
            popularBadPracticeCards[badPracticeCard.id] = 1;
          }
        }
      }
    }

    // Convertir les objets en tableaux pour les trier plus facilement
    const popularBestPracticeCardsArray = Object.entries(popularBestPracticeCards);
    const popularBadPracticeCardsArray = Object.entries(popularBadPracticeCards);

    // Trier les tableaux dans l'ordre décroissant en fonction du nombre d'occurrences
    popularBestPracticeCardsArray.sort((a, b) => Number(b[1]) - Number(a[1]));
    popularBadPracticeCardsArray.sort((a, b) => Number(b[1]) - Number(a[1]));

    // Extraire les trois premiers éléments de chaque tableau
    const top3BestPracticeCards = popularBestPracticeCardsArray.slice(0, 3);
    const top3BadPracticeCards = popularBadPracticeCardsArray.slice(0, 3);

    // Fusionner les tableaux obtenus en un seul tableau mostPopularCards
    for (const [id] of [...top3BestPracticeCards, ...top3BadPracticeCards]) {
      const card = this.cardDeck.find(card => card.id === id);
      if (card) {
        mostPopularCards.push(card);
      } else {
        throw new ServerException(SocketExceptions.GameError, 'Card not found');
      }
    }

    return mostPopularCards;
  }

  private saveToDatabase(winnerId: string): void {
    // NOTE: This isn't working yet;
    // The idea is to save the game to the database and save the player's met
    // to Green_IT_Booklet table 
    this.gameService.createGame(Number(winnerId));
  }


}
