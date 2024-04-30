import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { CardModule } from '@app/card/card.module';

@Module({
  providers: [
    // Gateways
    GameGateway,

    // Managers
    LobbyManager,
  ],
  imports: [
    CardModule,
  ],
})
export class GameModule
{
}
