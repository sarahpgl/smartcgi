import { Module } from '@nestjs/common';
import { BookletService } from './booklet.service';
import { BookletController } from './booklet.controller';
import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { Entity, Repository } from "typeorm";
import {Green_IT_Booklet} from '@app/entity/green_it_booklet'
import { UsersModule } from '@app/users/users.module';
import { UsersService } from '@app/users/users.service';
import { User_Game } from '@app/entity/user_game';
import { User } from '@app/entity/user';
import { Game } from '@app/entity/game';
import { forwardRef } from '@nestjs/common';

@Module({
  imports : [
    
    TypeOrmModule.forFeature([Green_IT_Booklet, User, User_Game, Game]),
    forwardRef(() => UsersModule),
  ],
  providers: [BookletService],
  controllers: [BookletController]
})
export class BookletModule {}
