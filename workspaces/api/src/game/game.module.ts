import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { CardModule } from '@app/card/card.module';
import { SensibilisationModule } from '@app/sensibilisation/sensibilisation.module';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '@app/entity/card';
import { Game } from '@app/entity/game';
import { Actor } from '@app/entity/actor';


@Module({
  imports: [
    CardModule,
    SensibilisationModule,
    TypeOrmModule.forFeature([Card]),
    TypeOrmModule.forFeature([Game]),
    TypeOrmModule.forFeature([Actor]),
  ],
  providers: [
    GameGateway,
    LobbyManager,
    GameService,
  ],
  controllers: [GameController],
  exports: [GameService],
  
})
export class GameModule {}
