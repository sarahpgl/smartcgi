import { Green_IT_Booklet } from '@app/entity/green_it_booklet';
import { User } from '@app/entity/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { error } from 'console';
import { Game } from '@app/entity/game';
import { User_Game } from '@app/entity/user_game';
import { AuthService } from '@app/authentification/authentification.service';
import { forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private users_repository: Repository<User>,
        @InjectRepository(Green_IT_Booklet)
        private booklet_repository: Repository<Green_IT_Booklet>,
        @InjectRepository(User_Game)
        private user_game_repository: Repository<User_Game>,
        @InjectRepository(Game)
        private game_repository: Repository<Game>,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService

    ){}


  async findOne(mail: string): Promise<User | undefined> {
    return this.users_repository.findOne({where: {mail}});
  }

  async createUser(mail: string, password: string, lastname: string, firstname: string): Promise<{user_id : number}> {
    let newUser = new User();
  
    newUser.mail = mail;
    newUser.password = password;
    newUser.last_name = lastname;
    newUser.first_name = firstname; 

    
    try {
      const temp = await this.users_repository.create(newUser);
      await this.users_repository.save(temp);
      return {user_id : temp.id};
    } catch (error) {
      
      throw new Error(error);
    }
    
  }

  async getBooklet(user_id : number) : Promise <{booklet : Green_IT_Booklet}>{

    try{
      let booklet :Green_IT_Booklet = await this.booklet_repository.findOne({where : {user_id : user_id}});
      return {booklet : booklet}
    }
    catch{
      throw error("Booklet not found");
    }

  }

  async getNbGames(access_token: string): Promise<{ nb_games: number }> {
    const user_id = await this.authService.getUserByToken(access_token);
    try {
      const nb_games = await this.user_game_repository.count({
        where: { 
          user_id: user_id
        } 
    });
      return { nb_games };
    } catch (error) {
      throw new Error("Error while getting the number of games");
    }
  }

  
  async getVictories(access_token: string): Promise<{ nb_victories: number }> {
    const user_id = await this.authService.getUserByToken(access_token);
    try {
      console.log(user_id);
      const nb_victories = await this.game_repository.count({
          where: {
              winner_id: user_id,
          }
      });
      console.log(nb_victories);
      return { nb_victories };
    } catch (error) {
        throw new Error("Error while getting the number of victories");
    }
  }


}

