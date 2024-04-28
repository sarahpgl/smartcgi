import { Cards } from '@shared/common/Cards';
import { Lobby } from '@app/game/lobby/lobby';
import { CardState } from '@app/game/instance/card-state';
import { ServerException } from '@app/game/server.exception';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { AuthenticatedSocket } from '@app/game/types';
import { SECOND } from '@app/game/constants';
import { Socket } from 'socket.io';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { ServerEvents } from '@shared/server/ServerEvents';

export class Instance
{

  constructor(
    private readonly lobby: Lobby,
  )
  {
  }

  public triggerStart(): void
  {
  }

  public triggerFinish(): void
  {
  }

  private transitionToNextRound(): void
  {
    
  }

}