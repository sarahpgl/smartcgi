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
import { LobbyCreateDto, LobbyJoinDto, PracticeAnswerDto } from '@app/game/dtos';
import { WsValidationPipe } from '@app/websocket/ws.validation-pipe';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger(GameGateway.name);

  constructor(private readonly lobbyManager: LobbyManager) {}

  afterInit(server: any) {
    this.lobbyManager.server = server;
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void>
  {
    // Call initializers to set up socket
    const authenticatedClient: AuthenticatedSocket = client as AuthenticatedSocket;
    authenticatedClient.gameData = {
      lobby: null,
      playerName: '',
    }

    this.lobbyManager.initializeSocket(authenticatedClient);
  }

  async handleDisconnect(client: AuthenticatedSocket): Promise<void>
  {
    // Handle termination of socket
    this.lobbyManager.terminateSocket(client);
  }

  @SubscribeMessage(ClientEvents.Ping)
  onPing(client: AuthenticatedSocket): void
  {
    this.logger.log('Ping received ', client.id);
    client.emit(ServerEvents.Pong, {
      message: 'pong',
    });
  }

  @SubscribeMessage(ClientEvents.LobbyCreate) 
  onLobbyCreate(client: AuthenticatedSocket, data: LobbyCreateDto) {
    const lobby = this.lobbyManager.createLobby(data.co2Quantity);
    lobby.addClient(client, data.playerName, true);
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(client: AuthenticatedSocket, data: LobbyJoinDto) {
    this.lobbyManager.joinLobby(data.connectionCode, data.playerName, client);
  }

  @SubscribeMessage(ClientEvents.LobbyLeave)
  onLobbyLeave(client: AuthenticatedSocket): void
  {
    client.gameData.lobby?.removeClient(client);
  }

  @SubscribeMessage(ClientEvents.LobbyStartGame)
  onLobbyStartGame(client: AuthenticatedSocket): void
  {
    this.lobbyManager.startGame(client);
  }

  @SubscribeMessage(ClientEvents.PracticeQuestion)
  onPracticeQuestion(client: AuthenticatedSocket, data: PracticeAnswerDto): void
  {
    if(!client.gameData.lobby) {
      throw new ServerException(SocketExceptions.GameError, 'Not in lobby');
    }
    client.gameData.lobby.instance.answerPracticeQuestion(client.id, data.cardId, data.answer);
  }
  //Todo: Handler for practice question

}