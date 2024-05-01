import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entity/user';
import { Green_IT_Booklet } from '@app/entity/green_it_booklet';
import { BookletService } from '@app/booklet/booklet.service';
import { BookletModule } from '@app/booklet/booklet.module';
import { UsersController } from './users.controller';


@Module({
  imports: [
    BookletModule,
    TypeOrmModule.forFeature([User, Green_IT_Booklet])
  ],
  providers: [UsersService, BookletService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

