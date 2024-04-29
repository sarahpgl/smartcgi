import { User } from '@app/entity/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';

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
}