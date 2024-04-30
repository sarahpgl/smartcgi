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
    const csvData: CsvCard[] = [];
    const stream = parse(file.buffer.toString(), {
      header: true,
      complete: results => {
        csvData.push(...results.data);
      },
      skipEmptyLines: true,
    });

    const cards = [];
    for(const row of csvData){
      const { id, cardType, language, label, description, link, actorType, networkGain, memoryGain, cpuGain, storageGain, difficulty } = row;
      let card: EntityCard = await this.cards_repository.findOne({ where: { id } });
      if (card == null) {
        card = this.cards_repository.create({id});
      }
      let card_content = this.card_contents_repository.create({ card, language, label, description });

      let actor = await this.actors_repository.findOne({ where: { language, title: actorType } });
      if (actor == null) {
        actor = this.actors_repository.create({ language, title: actorType });
        actor = await this.actors_repository.save(actor);
      }
      if(card.actors){
        card.actors.push(actor);
    } else {
      card.actors = [actor];
    }
    card = await this.cards_repository.save(card);


      switch (cardType) {
        case "Expert":
          card = await this.expert_cards_repository.save(card);
          break;
        case "Formation":
          card = await this.training_cards_repository.save({ ...card, link });
          break;
        case "Mauvaise pratique":
          let bad_practice_card = this.bad_practice_cards_repository.create(card as Bad_Practice_Card);
          bad_practice_card = {
            ...bad_practice_card,
            network_gain: !!networkGain,
            memory_gain: !!memoryGain,
            cpu_gain: !!cpuGain,
            storage_gain: !!storageGain,
            difficulty: difficulty
          };
          bad_practice_card = await this.bad_practice_cards_repository.save(bad_practice_card);
          card = bad_practice_card;
          break;
        default:
          let best_practice_card = this.best_practice_cards_repository.create(card as Best_Practice_Card);
          best_practice_card = {
            ...best_practice_card,
            network_gain: !!networkGain,
            memory_gain: !!memoryGain,
            cpu_gain: !!cpuGain,
            storage_gain: !!storageGain,
            difficulty: difficulty,
            carbon_loss: parseInt(cardType),
          };
          best_practice_card = await this.best_practice_cards_repository.save(best_practice_card);
          card = best_practice_card;
          break;
      }
      card_content.card_id = card.id;
      card_content = await this.card_contents_repository.save(card_content);
      cards.push(card);
    };
    return cards;
  }

  async getDeck(): Promise<Card[]> {
    /* A faire récupérer les cartes avec leurs différents types et informations
    *  Mélanger le deck et le renvoyer
    */
    return Promise.resolve([]);
  }

  async getBadPracticeCard(): Promise<Bad_Practice_Card[]> {
    return await this.bad_practice_cards_repository.find({relations: ["contents"]})
  }
}
