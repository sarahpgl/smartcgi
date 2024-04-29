import { User } from '@app/entity/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

// Il doit s'agir d'une véritable classe/interface représentant une entité utilisateur.

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private users_repository: Repository<User>
    ){

    }


  async findOne(mail: string): Promise<User | undefined> {
    return this.users_repository.findOne({where: {mail}});
  }

  async createUser(mail: string, password: string, lastname: string, firstname: string): Promise<void> {
    let newUser = new User();
    newUser.mail = mail;
    console.log(mail);
    newUser.password = password; 
    console.log(password);
    newUser.last_name = lastname;
    console.log(lastname);
    newUser.first_name = firstname; 
    console.log(firstname);
    newUser.green_it_booklet_id = Math.floor(Math.random() * 1000000); // Génère un entier aléatoire entre 0 et 999999
    console.log(newUser.green_it_booklet_id);
    
    try {
      const temp = await this.users_repository.create(newUser);
      await this.users_repository.save(temp);
    } catch (error) {
      // Gérez l'erreur de sauvegarde de l'utilisateur
      throw new Error(error);
    }
  }

}

