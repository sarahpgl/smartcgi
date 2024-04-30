import { Lobby } from '@app/game/lobby/lobby';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '@app/game/types';
import { ServerException } from '@app/game/server.exception';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { LOBBY_MAX_LIFETIME } from '@app/game/constants';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { CO2Quantity } from '@app/game/lobby/types';
import { Cron } from '@nestjs/schedule'
import { CardService } from '@app/card/card.service';

export class LobbyManager
{
  public server: Server;

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<Lobby['id'], Lobby>();

  constructor (
    private readonly cardService: CardService,
  )
  {
  }

  public initializeSocket(client: AuthenticatedSocket): void
  {
    client.gameData.lobby = null;
  }

  public terminateSocket(client: AuthenticatedSocket): void
  {
    client.gameData.lobby?.removeClient(client);
  }

  public createLobby(co2Quantity: CO2Quantity): Lobby
  {
    const lobby = new Lobby(this.server, this.cardService, co2Quantity );

    this.lobbies.set(lobby.id, lobby);

    return lobby;
  }

  public joinLobby(connectionCode: string, playerName: string, client: AuthenticatedSocket): void
  {
    const lobby = Array.from(this.lobbies.values()).find((lobby) => lobby.connectionCode === connectionCode)

    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
    }

    if (lobby.clients.size >= lobby.maxClients) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby already full');
    }

    lobby.addClient(client, playerName);
  }

  public startGame(client: AuthenticatedSocket): void
  {
    const lobby = client.gameData.lobby;

    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Not in lobby');
    }

    if (lobby.lobbyOwner !== client) {
      throw new ServerException(SocketExceptions.LobbyError, 'Only lobby owner can start the game');
    }

    lobby.instance.triggerStart();
  }

  // Periodically clean up lobbies
  @Cron('*/5 * * * *')
  private lobbiesCleaner(): void
  {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = (new Date()).getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        //TODO: Notify clients that lobby is closing

        lobby.instance.triggerFinish();

        this.lobbies.delete(lobby.id);
      }
    }
  }
}