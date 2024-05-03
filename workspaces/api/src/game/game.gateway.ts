import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsResponse,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';
import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { Logger, UsePipes } from '@nestjs/common';
import { AuthenticatedSocket } from '@app/game/types';
import { ServerException } from '@app/game/server.exception';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { ClientReconnectDto, ClientStartGameDto, LobbyCreateDto, LobbyJoinDto, PracticeAnswerDto } from '@app/game/dtos';
import { WsValidationPipe } from '@app/websocket/ws.validation-pipe';
import { BestPracticeAnswerType } from '@shared/common/Game';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(GameGateway.name);

  constructor(private readonly lobbyManager: LobbyManager) { }

  afterInit(server: any) {
    this.lobbyManager.server = server;
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    // TODO: Handle reconnection
    this.logger.log('Client connected', client.id);
    const authenticatedClient: AuthenticatedSocket = client as AuthenticatedSocket;
    authenticatedClient.gameData = {
      lobby: null,
      playerName: null,
      clientInGameId: null,
    }

    this.lobbyManager.initializeSocket(authenticatedClient);
  }

  async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
    // Handle termination of socket
    this.lobbyManager.terminateSocket(client);
  }

  @SubscribeMessage(ClientEvents.Ping)
  onPing(client: AuthenticatedSocket): void {
    this.logger.log('Ping received ', client.id);
    client.emit(ServerEvents.Pong, {
      message: 'pong',
    });
  }

  @SubscribeMessage(ClientEvents.LobbyCreate)
  onLobbyCreate(client: AuthenticatedSocket, data: LobbyCreateDto) {
    //console.log('Creating lobby', data.co2Quantity);
    const lobby = this.lobbyManager.createLobby(data.co2Quantity);
    lobby.addClient(client, data.playerName, null, true);
    //console.log('Lobby created', lobby.instance.co2Quantity);
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(client: AuthenticatedSocket, data: LobbyJoinDto) {
    this.lobbyManager.joinLobby(client, data.connectionCode, data.playerName, data.clientInGameId);
  }

  @SubscribeMessage(ClientEvents.LobbyLeave)
  onLobbyLeave(client: AuthenticatedSocket): void {
    client.gameData.lobby?.removeClient(client);
  }

  @SubscribeMessage(ClientEvents.LobbyStartGame)
  onLobbyStartGame(client: AuthenticatedSocket, data: ClientStartGameDto): void {
    this.lobbyManager.startGame(client, data.clientInGameId);
  }

  @SubscribeMessage(ClientEvents.AnswerPracticeQuestion)
  onPracticeQuestion(client: AuthenticatedSocket, data: PracticeAnswerDto): void {
    if (!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    const cardType = data.cardType;
    switch (cardType) {
      case 'BestPractice':
        client.gameData.lobby.instance.answerBestPracticeQuestion(client.id, data.cardId, data.answer);
        break;
      case 'BadPractice':
        client.gameData.lobby.instance.answerBadPracticeQuestion(client.id, data.cardId, data.answer);
        break;
      default:
        throw new ServerException(SocketExceptions.GameError, 'Invalid card type');
    }
  }

  // TODO: Deal with client reconnect
  @SubscribeMessage(ClientEvents.ClientReconnect)
  onClientReconnect(client: AuthenticatedSocket, data: ClientReconnectDto): void {
    this.logger.log('Client reconnecting', data.clientInGameId);
    this.lobbyManager.reconnectClient(client, data.clientInGameId);
  }


}
