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
import { PracticeAnswerType } from '@shared/common/Game';

export class Instance
{
  public co2Quantity: CO2Quantity;
  public playerStates: Record<Socket['id'], PlayerState> = {};
  public cardDeck: Card[] = [];
  public discardPile: Card[] = [];
  public currentPlayer: string;
  private answerCount: number = 0;

  constructor(
    private readonly lobby: Lobby,
  )
  {
  }

  public triggerStart(): void
  {
    this.lobby.clients.forEach((client) =>
    {
      this.playerStates[client.id] = new PlayerState(client.gameData.playerName, client.id, this.co2Quantity);
    });

    //Set the first player
    this.currentPlayer = this.lobby.clients.keys().next().value;

    this.lobby.dispatchGameStart();
  }

  public triggerFinish(): void
  {
  }

  public playCard(card: Card, client:AuthenticatedSocket) {
    const playerState = this.playerStates[client.id];

    if (!playerState) {
      throw new ServerException(SocketExceptions.GameError, 'Player not found');
    }

    if (!playerState.canPlay) {
      throw new ServerException(SocketExceptions.GameError, 'Player cannot play');
    }

    if(playerState.badPractice && card.cardType !== 'Formation' && card.cardType !== 'Expert' && card.actor !== playerState.badPractice) {
      throw new ServerException(SocketExceptions.GameError, 'Player must play a fitting formation or expert card');
    }

    playerState.cardsHistory.push(card);
    playerState.cardsInHand = playerState.cardsInHand.filter((c) => c !== card);
    switch(card.cardType) {
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
    //Passer au joueur suivant
  }

  public answerPracticeQuestion(playerId: string, cardId: string, answer: PracticeAnswerType): void
  {
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

  private playBestPractice(card: Best_Practice_Card, playerState: PlayerState) {
    //Ajouter le CO2
    playerState.co2Saved -= card.carbon_loss;
    //Poser la question
    this.answerCount = 0;
    this.lobby.dispatchPracticeQuestion(card, playerState.playerName);
  }

  private playExpert(card: Expert_Card, playerState: PlayerState) {
  }

  private playBadPractice(card: Bad_Practice_Card, playerState: PlayerState) {
  }

  private playFormation(card: Formation_Card, playerState: PlayerState) {
  }

  private drawCard(playerState: PlayerState) {
    //Piocher une carte
  }

  private transitionToNextRound(): void
  {
    
  }

}