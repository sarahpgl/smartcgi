import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entity/card';
import { Actor } from './entity/actor';
import { Training_Card } from './entity/training_card';
import { Expert_Card } from './entity/expert_card';
import { Card_Content } from './entity/card_content';
import { Practice_Card } from './entity/practice_card';
import { Best_Practice_Card } from './entity/best_practice_card';
import { Bad_Practice_Card } from './entity/bad_practice_card';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password : process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_URL,
      entities : [
        Card,
        Actor,
        Training_Card,
        Expert_Card,
        Card_Content,
        Practice_Card,
        Best_Practice_Card, 
        Bad_Practice_Card
      ],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
