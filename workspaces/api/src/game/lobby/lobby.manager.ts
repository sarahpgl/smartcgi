import { Lobby } from '@app/game/lobby/lobby';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '@app/game/types';
import { ServerException } from '@app/game/server.exception';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { LOBBY_MAX_LIFETIME } from '@app/game/constants';
import { CO2Quantity } from '@app/game/lobby/types';
import { Cron } from '@nestjs/schedule'
import { CardService } from '@app/card/card.service';
import { Inject } from '@nestjs/common';
import { SensibilisationService } from '@app/sensibilisation/sensibilisation.service';

export class LobbyManager {
  public server: Server;

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<Lobby['id'], Lobby>();

  @Inject(CardService)
  private readonly cardService: CardService;

  @Inject(SensibilisationService)
  private readonly sensibilisationService: SensibilisationService;
  public initializeSocket(client: AuthenticatedSocket): void {
    client.gameData.lobby = null;
  }

  public terminateSocket(client: AuthenticatedSocket): void {
    client.gameData.lobby?.removeClient(client);
  }

  public createLobby(co2Quantity: CO2Quantity): Lobby {
    const lobby = new Lobby(this.server, this.cardService,this.sensibilisationService , co2Quantity);
    //console.log('Creating lobby', co2Quantity);
    this.lobbies.set(lobby.id, lobby);

    return lobby;
  }

  public joinLobby(client: AuthenticatedSocket, connectionCode: string, playerName: string, playerInGameId: string | null): void {
    const lobby = Array.from(this.lobbies.values()).find((lobby) => lobby.connectionCode === connectionCode)

    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
    }

    if (lobby.clients.size >= lobby.maxClients) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby already full');
    }

    lobby.addClient(client, playerName, playerInGameId);
  }

  public startGame(client: AuthenticatedSocket, playerInGameId: string): void {
    const lobby = client.gameData.lobby;

    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Not in lobby');
    }

    if (lobby.lobbyOwnerId !== playerInGameId) {
      throw new ServerException(SocketExceptions.LobbyError, 'Only lobby owner can start the game');
    }

    lobby.instance.triggerStart();
  }

  public reconnectClient(client: AuthenticatedSocket, clientInGameId: string): void {
    const lobby = Array.from(this.lobbies.values()).find((lobby) => lobby.disconnectedClients.has(clientInGameId));

    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Client not found');
    }

    lobby.reconnectClient(client, clientInGameId);

  }

  // Periodically clean up lobbies
  @Cron('*/5 * * * *')
  private lobbiesCleaner(): void {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = (new Date()).getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        //TODO: Notify clients that lobby is closing

        this.lobbies.delete(lobby.id);
      }
    }
  }
}
