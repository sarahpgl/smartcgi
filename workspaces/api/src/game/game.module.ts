import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { CardModule } from '@app/card/card.module';
import { SensibilisationModule } from '@app/sensibilisation/sensibilisation.module';

@Module({
  providers: [
    // Gateways
    GameGateway,

    // Managers
    LobbyManager,
  ],
  imports: [
    CardModule,
    SensibilisationModule,
  ],
})
export class GameModule
{
}
