import { Green_IT_Booklet } from '../entity/green_it_booklet';
import { User } from '@app/entity/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookletService {
    constructor(
        @InjectRepository(User)
        private user_repository : Repository<User>,
        @InjectRepository(Green_IT_Booklet)
        private readonly booklet_repository : Repository<Green_IT_Booklet>
       
    ){}

    async createBooklet(user_id : number) : Promise <{booklet : Green_IT_Booklet}>{
        let user = this.user_repository.findOne({where : {id : user_id}});
        if (!user) {
            
            throw new Error(`User with id ${user_id} not found`);
        }
        let booklet : Green_IT_Booklet = this.booklet_repository.create({
            user_id: user_id,
            user : user[0] ,
            practices_to_ban :[],
            practices_to_apply :[],
            trainings : [],
        });
        (await user).green_it_booklet_id = booklet.id;
        await this.booklet_repository.save(booklet);
        return {booklet: booklet};
    }
}
