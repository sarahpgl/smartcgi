import { Injectable } from '@nestjs/common';
import { Game } from '@app/entity/game';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game_Status } from '@app/entity/game';

@Injectable()
export class GameService { 
    constructor(
        @InjectRepository(Game)
        private game_repository: Repository<Game>,
    ) {  }

    async createGame(winnerId : number): Promise<{game_id: number}> {
        console.log('GameService : createGame');
        let newGame = new Game();
        newGame.winner_id = winnerId;
        newGame.created_at = new Date();
        newGame.updated_at = new Date();
        newGame.finished_at = new Date();
        newGame.round = 1;
        newGame.user_turn = 1;
        newGame.status = Game_Status.FINISHED;
        newGame.discard_stack = [];
        newGame.deck_stack = [];
        newGame.questions = [];
        newGame.users = [];
        try {
            const temp = this.game_repository.create(newGame);
            await this.game_repository.save(temp);
            console.log('game_id : ', temp.id);
            return {game_id: temp.id};
        } catch (error) {
            throw new Error(error);
        }
    }
}
