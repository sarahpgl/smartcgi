import { Green_IT_Booklet } from '@app/entity/green_it_booklet';
import { User } from '@app/entity/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BookletService } from '@app/booklet/booklet.service';
import { getConnection } from 'typeorm';
import { error } from 'console';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private users_repository: Repository<User>,
        @InjectRepository(Green_IT_Booklet)
        private booklet_repository: Repository<Green_IT_Booklet>,

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


}

