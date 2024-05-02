import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { ServerEvents } from '@shared/server/ServerEvents';
import { AuthenticatedSocket } from '@app/game/types';
import { Instance } from '@app/game/instance/instance';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { Practice_Card } from '@shared/common/Cards';
import { SensibilisationQuestion } from '@shared/common/Game';
import { CardService } from '@app/card/card.service';

export class Lobby {
  public readonly id: string = v4();

  public readonly createdAt: Date = new Date();

  public readonly connectionCode: string = (Math.random() * 100000000 + '').substring(0, 6);

  public readonly maxClients: number = 4;

  public lobbyOwnerId: string;

  public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>();

  public readonly instance: Instance = new Instance(this);

  constructor(
    private readonly server: Server,
    private readonly cardService: CardService,
    co2Quantity: number,
  ) {
    this.instance.cardService = cardService;
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
    this.dispatchLobbyState();
  }

  public removeClient(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.gameData.lobby = null;

    // If player leave then the game isn't worth to play anymore
    this.instance.triggerFinish();

    // TODO: Notify other players that someone left

    this.dispatchLobbyState();
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

  public dispatchPracticeQuestion(card: Practice_Card, playerName: string): void {
    const payload: ServerPayloads[ServerEvents.PracticeQuestion] = {
      playerName,
      cardType: card.cardType,
    };

    this.dispatchToLobby(ServerEvents.PracticeQuestion, payload);
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

  public dispatchToLobby<T extends ServerEvents>(event: T, payload: ServerPayloads[T]): void {
    this.server.to(this.id).emit(event, payload);
  }

  public emitToClient<T extends ServerEvents>(client: AuthenticatedSocket, event: T, payload: ServerPayloads[T]): void {
    client.emit(event, payload);
  }
}
