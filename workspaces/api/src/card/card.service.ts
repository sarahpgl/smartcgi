import { Injectable } from "@nestjs/common";
import { parse } from "papaparse";
import { CsvCard } from "./card.type";
import { Card as EntityCard } from "@app/entity/card";
import { Expert_Card } from "@app/entity/expert_card";
import { InjectRepository } from "@nestjs/typeorm";
import { Entity, Repository } from "typeorm";
import { Best_Practice_Card } from "@app/entity/best_practice_card";
import { Bad_Practice_Card } from "@app/entity/bad_practice_card";
import { Training_Card } from "@app/entity/training_card";
import { Card_Content } from "@app/entity/card_content";
import { Actor } from "@app/entity/actor";
import { Practice_Card } from "@app/entity/practice_card";
import { Card } from "@shared/common/Cards";
import { Best_Practices_Status } from "@app/entity/user_game";
import { info } from "console";

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(EntityCard)
    private cards_repository: Repository<EntityCard>,
    @InjectRepository(Best_Practice_Card)
    private best_practice_cards_repository: Repository<Best_Practice_Card>,
    @InjectRepository(Bad_Practice_Card)
    private bad_practice_cards_repository: Repository<Bad_Practice_Card>,
    @InjectRepository(Expert_Card)
    private expert_cards_repository: Repository<Expert_Card>,
    @InjectRepository(Training_Card)
    private training_cards_repository: Repository<Training_Card>,
    @InjectRepository(Card_Content)
    private card_contents_repository: Repository<Card_Content>,
    @InjectRepository(Actor)
    private actors_repository: Repository<Actor>,
  ) {}

  async parseCsv(file: Express.Multer.File) {
    console.log('on parse le csv');
    const csvData: CsvCard[] = [];
    const stream = parse(file.buffer.toString(), {
      header: true,
      complete: results => {
        csvData.push(...results.data);
      },
      skipEmptyLines: true,
    });

    const cards = [];
    for (const row of csvData) {
      const { id, cardType, language, label, description, link, actorType, networkGain, memoryGain, cpuGain, storageGain, difficulty } = row;
      console.log(row);
      let card: EntityCard = await this.cards_repository.findOne({ where: { id } });
      let card_already_exists = true;
      if (card == null) {
        card_already_exists  = false;
        card = this.cards_repository.create({ id });
      }

      let actor = await this.actors_repository.findOne({ where: { language, title: actorType } });
      if (actor == null) {
        actor = this.actors_repository.create({ language, title: actorType });
        actor = await this.actors_repository.save(actor);
      }
      if (card.actors) {
        card.actors.push(actor);
      } else {
        card.actors = [actor];
      }
      card = await this.cards_repository.save(card);

      switch (cardType) {
        case "Expert":
          let expert_card = new Expert_Card();
          Object.assign(expert_card,card);
          if(card_already_exists){
              expert_card = await this.expert_cards_repository.findOne({ where: { id } });
          }
          card = await this.expert_cards_repository.save(expert_card);
          break;
        case "Formation":
          let training_card = new Training_Card()
          Object.assign(training_card, card);
          if(card_already_exists){
            training_card = await this.training_cards_repository.findOne({ where: { id } });
          }
          training_card.link = link;
          card = await this.training_cards_repository.save(training_card);
          break;
        case "Mauvaise pratique":
          let bad_practice_card = new Bad_Practice_Card()
          Object.assign(bad_practice_card, card);
          if(card_already_exists){
            bad_practice_card = await this.bad_practice_cards_repository.findOne({ where: { id } });
          }
          bad_practice_card = {
            ...bad_practice_card,
            network_gain: !!networkGain,
            memory_gain: !!memoryGain,
            cpu_gain: !!cpuGain,
            storage_gain: !!storageGain,
            difficulty: difficulty,
          };
          card = await this.bad_practice_cards_repository.save(bad_practice_card);
          break;
        default:
          let best_practice_card = new Best_Practice_Card()
          Object.assign(best_practice_card, card);
          if(card_already_exists){
            best_practice_card = await this.best_practice_cards_repository.findOne({ where: { id } });
          }
          best_practice_card = {
            ...best_practice_card,
            network_gain: !!networkGain,
            memory_gain: !!memoryGain,
            cpu_gain: !!cpuGain,
            storage_gain: !!storageGain,
            difficulty: difficulty,
            carbon_loss: parseInt(cardType)
          };
          card = await this.best_practice_cards_repository.save(best_practice_card);
          break;
      }
      let card_content = await this.card_contents_repository.findOne({ where: { card_id: card.id, language } });
      if (card_content == null) {
        card_content = this.card_contents_repository.create({ card_id: card.id, card, language, label, description });
      }
      card_content = await this.card_contents_repository.save(card_content);
      cards.push(card);
    }
    return cards;
  }

  async getDeck(): Promise<Card[]> {
    /* A faire récupérer les cartes avec leurs différents types et informations
     *  Mélanger le deck et le renvoyer
     */
    return Promise.resolve([]);
  }

  async getBadPracticeCard(): Promise<Bad_Practice_Card[]> {
    return await this.bad_practice_cards_repository.find({ relations: ["contents"] });
  }
}
