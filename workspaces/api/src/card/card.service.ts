import { Injectable } from "@nestjs/common";
import { parse } from "papaparse";
import { CsvCard } from "./card.type";
import { Card as EntityCard } from "@app/entity/card";
import { Expert_Card as EntityExpert } from "@app/entity/expert_card";
import { InjectRepository } from "@nestjs/typeorm";
import { Entity, Repository } from "typeorm";
import { Best_Practice_Card as EntityBestPractice} from "@app/entity/best_practice_card";
import { Bad_Practice_Card as EntityBadPractice } from "@app/entity/bad_practice_card";
import { Training_Card as EntityTraining} from "@app/entity/training_card";
import { Card_Content } from "@app/entity/card_content";
import { Actor as EntityActor} from "@app/entity/actor";
import { Practice_Card } from "@app/entity/practice_card";
import { Card, Formation_Card, Best_Practice_Card, Bad_Practice_Card, Expert_Card } from "@shared/common/Cards";
import { Best_Practices_Status } from "@app/entity/user_game";
import { Actor } from "@shared/common/Cards";


@Injectable()
export class CardService {
  constructor(
    @InjectRepository(EntityCard)
    private cards_repository: Repository<EntityCard>,
    @InjectRepository(EntityBestPractice)
    private best_practice_cards_repository: Repository<EntityBestPractice>,
    @InjectRepository(EntityBadPractice)
    private bad_practice_cards_repository: Repository<EntityBadPractice>,
    @InjectRepository(EntityExpert)
    private expert_cards_repository: Repository<EntityExpert>,
    @InjectRepository(EntityTraining)
    private training_cards_repository: Repository<EntityTraining>,
    @InjectRepository(Card_Content)
    private card_contents_repository: Repository<Card_Content>,
    @InjectRepository(EntityActor)
    private actors_repository: Repository<EntityActor>,
  ) {}

  // Method to parse CSV file and create cards
  async parseCsv(file: Express.Multer.File) {
    const csvData: CsvCard[] = [];
    // Parsing CSV file
    const stream = parse(file.buffer.toString(), {
      header: true,
      complete: results => {
        csvData.push(...results.data);
      },
      skipEmptyLines: true,
    });

    const cards = [];
    // Iterating through parsed CSV data
    for(const row of csvData){
      // Extracting data from each row
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

    // Saving different types of cards based on cardType
    switch (cardType) {
      case "Expert":
        card = await this.expert_cards_repository.save(card);
        break;
      case "Formation":
        card = await this.training_cards_repository.save({ card, link });
        break;
      case "Mauvaise pratique":
        let bad_practice_card = this.bad_practice_cards_repository.create(card as EntityBadPractice);
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
        let best_practice_card = this.best_practice_cards_repository.create(card as EntityBestPractice);
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

  
  // Method to retrieve shuffled deck of cards
  async getDeck(): Promise<any> {

    // Shuffling and formatting bad practice cards
    const badPracticeCards = await this.bad_practice_cards_repository.find({relations: ["contents", "actors"]});
    console.log(badPracticeCards);
    console.log(badPracticeCards[0].contents);
    const deckBadPracticeCards = this.shuffleArray(badPracticeCards).slice(0, 12);
    const formattedBadPracticeCards: Bad_Practice_Card[] = deckBadPracticeCards.map((card: EntityBadPractice
    ) => ({
      id: card.id.toString(),
      actor: this.getActorName(card.actors[0].title), 
      title: card.contents[0] ? card.contents[0].label : 'No label', 
      contents: card.contents[0] ? card.contents[0].description : 'No description', 
      cardType: 'BadPractice',
      network_gain: card.network_gain,
      memory_gain: card.memory_gain,
      cpu_gain: card.cpu_gain,
      storage_gain: card.storage_gain,
      difficulty: card.difficulty,
    }));
    
    // Shuffling and formatting best practice cards
    const bestPracticeCards = await this.best_practice_cards_repository.find({relations: ["contents", "actors"]});
    const deckBestPracticeCards = this.shuffleArray(bestPracticeCards).slice(0, 50);
    const formattedBestPracticeCards: Best_Practice_Card[] = deckBestPracticeCards.map((card: EntityBestPractice) => ({
      id: card.id.toString(),
      actor: this.getActorName(card.actors[0].title), 
      title: card.contents[0] ? card.contents[0].label : 'No label', 
      contents: card.contents[0] ? card.contents[0].description : 'No description',
      cardType: 'BestPractice',
      network_gain: card.network_gain,
      memory_gain: card.memory_gain,
      cpu_gain: card.cpu_gain,
      storage_gain: card.storage_gain,
      difficulty: card.difficulty,
      carbon_loss: card.carbon_loss,
    }));

    // Shuffling and formatting expert cards
    const expertCards = await this.expert_cards_repository.find({relations: ["contents", "actors"]});
    const deckExpertCards = this.shuffleArray(expertCards).slice(0, 3);
    const formattedExpertCards: Expert_Card[] = deckExpertCards.map((card: EntityExpert) => ({
      id: card.id.toString(),
      actor: this.getActorName(card.actors[0].title), 
      title: card.contents[0] ? card.contents[0].label : 'No label', 
      contents: card.contents[0] ? card.contents[0].description : 'No description', 
      cardType: 'Expert',
    }));

    // Shuffling and formatting training cards
    const trainingCards = await this.training_cards_repository.find({relations: ["contents", "actors"]});
    const deckTrainingCards = this.shuffleArray(trainingCards).slice(0, 18);
    const formattedTrainingCards: Formation_Card[] = deckTrainingCards.map((card: EntityTraining) => ({
      id: card.id.toString(),
      actor: this.getActorName(card.actors[0].title), 
      title: card.contents[0] ? card.contents[0].label : 'No label', 
      contents: card.contents[0] ? card.contents[0].description : 'No description', 
      cardType: 'Formation',
      linkToFormation: card.link, 
    }));


    const allCards = [formattedBadPracticeCards, formattedBestPracticeCards, formattedExpertCards, formattedTrainingCards];

    const shuffledCards = this.shuffleArray(allCards);
    console.log(shuffledCards); 
    return shuffledCards;

  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private getActorName(actorTitle : string): Actor{
    switch(actorTitle){
      case 'Architecte':
        return 'Architect';
      case 'Développeur':
        return 'Developer';
      case 'Product Owner':
        return 'ProductOwner';
      default:
        throw new Error(`Unexpected actor title: ${actorTitle}`);
    }
  }

}
