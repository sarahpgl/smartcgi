import { Injectable } from '@nestjs/common';
import { CsvQuizz } from './sensibilisation.type';
import { parse } from "papaparse";
import { Question } from '@app/entity/question';
import { InjectRepository } from "@nestjs/typeorm";
import { Entity, Repository } from "typeorm";
import { Question_Answer } from '@app/entity/question_answer';
import { Question_Content } from '@app/entity/question_content';

@Injectable()
export class SensibilisationService {
    constructor(
        @InjectRepository(Question)
        private question_repository: Repository<Question>,
        @InjectRepository(Question_Answer)
        private question_answer_repository: Repository<Question_Answer>,
        @InjectRepository(Question_Content)
        private question_content_repository: Repository<Question_Content>
        
    ){}

    async parseCsv(file: Express.Multer.File) {
        const csvData: CsvQuizz[] = [];
        const stream = parse(file.buffer.toString(), {
        header: true,
        complete: results => {
            csvData.push(...results.data);
        },
        skipEmptyLines: true,
        });

        const cards = [];
        for(const row of csvData){
          const { id, language, question, response1, response2, response3, solutionnb} = row;
          let card: Question = await this.question_repository.findOne({ where: { id } });
          if (card == null) {
            card = this.question_repository.create({
                games: null
            });
            card = await this.question_repository.save(card);
          }
          

          let card_content: Question_Content = await this.question_content_repository.findOne({ where: { question_id: card.id } });
          let card_answer : Question_Answer = await this.question_answer_repository.findOne({ where: { question_id : card.id } });
          if (card_content==null){
            card_content = this.question_content_repository.create({
                
                question_id: id,
                language: language,
                label: "Label de la question",
                description: question, 
                question: card ,
                response1: response1,
                response2 : response2,
                response3 : response3
                });
    
        }
          
          card_content.question_id = card.id;
          card_content = await this.question_content_repository.save(card_content);


            if (card_answer == null) {
                card_answer = this.question_answer_repository.create({
                    question_id : id,
                    question : card, 
                    language : language, 
                    answer : solutionnb, 
                    is_good_answer:false,
                });
            }
            
            
      card_answer = await this.question_answer_repository.save(card_answer);
        if (card == null) {
            card = this.question_repository.create({
                 ...card_answer,
                ...card_content,
                games: null
            });
          }
          card = await this.question_repository.save(card);


    

            cards.push(card);
        };
        return cards;
    }
}