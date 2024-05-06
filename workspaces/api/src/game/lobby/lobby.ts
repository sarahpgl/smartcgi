import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { ServerEvents } from '@shared/server/ServerEvents';
import { AuthenticatedSocket } from '@app/game/types';
import { Instance } from '@app/game/instance/instance';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { Card } from '@shared/common/Cards';
import { SensibilisationQuestion } from '@shared/common/Game';
import { CardService } from '@app/card/card.service';
import { CO2Quantity } from './types';
import { SensibilisationService } from '@app/sensibilisation/sensibilisation.service';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { ServerException } from '../server.exception';

export class Lobby {
  public readonly id: string = v4();

  public readonly createdAt: Date = new Date();

  public readonly connectionCode: string = (Math.random() * 100000000 + '').substring(0, 6);

  public readonly maxClients: number = 4;

  public lobbyOwnerId: string;

  public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>();

  // Keep in memory the clients that disconnected Map<clientInGameId, playerName>
  public readonly disconnectedClients: Map<string, string> = new Map<string, string>();

  public readonly instance: Instance = new Instance(this, this.cardService, this.sensibilisationService);
  

  constructor(
    private readonly server: Server,
    private readonly cardService: CardService,
    private readonly sensibilisationService : SensibilisationService,
    co2Quantity: number,
  ) {
    this.instance.co2Quantity = co2Quantity;
  }

  public addClient(client: AuthenticatedSocket, playerName: string, clientInGameId: string | null = null, isOwner: boolean = false): void {
    this.clients.set(client.id, client);
    client.join(this.id);
    if (!clientInGameId) clientInGameId = v4();
    client.gameData = {
      playerName,
      lobby: this,
      clientInGameId,
    }

    if (isOwner) {
      this.lobbyOwnerId = clientInGameId;
    }
    this.emitToClient(client, ServerEvents.LobbyJoined, { clientInGameId });
    console.log(`[Lobby] Client ${client.id} joined lobby ${this.id} as ${clientInGameId}`);
    if (this.instance.gameStarted) {
      this.dispatchGameState();
    } else {
      this.dispatchLobbyState();
    }
  }

  public removeClient(client: AuthenticatedSocket): void {
    this.disconnectedClients.set(client.gameData.clientInGameId, client.gameData.playerName);
    this.clients.delete(client.id);
    client.leave(this.id);
    client.gameData.lobby = null;

    this.dispatchLobbyState();
  }

  public reconnectClient(client: AuthenticatedSocket, clientInGameId: string): void {
    console.log(`[Lobby] Client`, client.id, 'reconnected as', clientInGameId);
    const playerName = this.disconnectedClients.get(clientInGameId);
    const isOwner = clientInGameId === this.lobbyOwnerId;
    this.addClient(client, playerName, clientInGameId, isOwner);
    this.disconnectedClients.delete(clientInGameId);
  }

  public dispatchLobbyState(): void {
    const clientsNames: Record<string, string> = {};
    this.clients.forEach((client) => {
      clientsNames[client.gameData.clientInGameId] = client.gameData.playerName;
    });
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      connectionCode: this.connectionCode,
      co2Quantity: this.instance.co2Quantity,
      ownerId: this.lobbyOwnerId,
      clientsNames,
    };

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }
  
  public dispatchSensibilisationQuestion(question: SensibilisationQuestion): void {
    const payload: ServerPayloads[ServerEvents.SensibilisationQuestion] = {
      question_id : question.question_id,
      question: question.question,
      answers: {
        response1 : question.answers.response1,
        response2 : question.answers.response2,
        response3 : question.answers.response3,
        answer : question.answers.answer
      }
    };
    this.dispatchToLobby(ServerEvents.SensibilisationQuestion, payload);
  }

  public dispatchGameState(): void {
    const payload: ServerPayloads[ServerEvents.GameState] = {
      currentPlayerId: this.instance.currentPlayerId,
      playerStates: Object.values(this.instance.playerStates),
      discardPile: this.instance.discardPile,
    };

    this.dispatchToLobby(ServerEvents.GameState, payload);
  }

  public dispatchGameStart(question: SensibilisationQuestion): void {
    const payload: ServerPayloads[ServerEvents.GameStart] = {
      gameState: {
        currentPlayerId: this.instance.currentPlayerId,
        playerStates: Object.values(this.instance.playerStates),
        discardPile: this.instance.discardPile,
      },
      sensibilisationQuestion: question,
    };
    this.dispatchToLobby(ServerEvents.GameStart, payload);
  }

  public dispatchCardPlayed(card: Card, playerId: string, playerName: string, discarded: boolean = false): void {
    const payload: ServerPayloads[ServerEvents.CardPlayed] = {
      playerId,
      playerName,
      card,
      discarded
   };
    this.dispatchToLobby(ServerEvents.CardPlayed, payload);
  }

  public dispatchPlayerPassed(playerName: string): void {
    const payload: ServerPayloads[ServerEvents.PlayerPassed] = {
      playerName
    };
    this.dispatchToLobby(ServerEvents.PlayerPassed, payload);
  }

  public dispatchSensibilisationAnswered() {
    this.dispatchToLobby(ServerEvents.SensibilisationAnswered, {});
  }

  public dispatchPracticeAnswered() {
    this.dispatchToLobby(ServerEvents.PracticeAnswered, {});
  }

  public emitGameReport(gameReport: { myArchivedCards: Card[], mostPopularCards: Card[] } , playerId: string, winnerName: string): void{
    const payload: ServerPayloads[ServerEvents.GameReport] = {
      mostPopularCards : gameReport.mostPopularCards,
      myArchivedCards : gameReport.myArchivedCards,
      winnerName : winnerName,
    };
    this.emitToClient(this.clients.get(playerId), ServerEvents.GameReport, payload);
  }

  public emitUseSensibilisationPoints(sensibilisationPoints: number, clientInGameId: string, isBlocked: boolean, formationCardLeft: boolean, expertCardLeft: boolean): void{
    const payload: ServerPayloads[ServerEvents.UseSensibilisationPoints] = {
      sensibilisationPoints: sensibilisationPoints,
      isBlocked: isBlocked,
      formationCardLeft: formationCardLeft,
      expertCardLeft: expertCardLeft
    };
    let emittedClient: AuthenticatedSocket | null = null;
    this.clients.forEach((client) => {
      if(client.gameData.clientInGameId === clientInGameId){
        emittedClient = client;
      } 
    });
    if (emittedClient === null) {
      throw new ServerException(SocketExceptions.GameError, 'Client not found');
    }

    this.emitToClient(emittedClient, ServerEvents.UseSensibilisationPoints, payload);
  }

  public dispatchToLobby<T extends ServerEvents>(event: T, payload: ServerPayloads[T]): void {
    this.server.to(this.id).emit(event, payload);
  }

  public emitToClient<T extends ServerEvents>(client: AuthenticatedSocket, event: T, payload: ServerPayloads[T]): void {
    client.emit(event, payload);
  }
}
