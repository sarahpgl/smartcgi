import { Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Actor } from "./actor";
import { Card_Content } from "./card_content";
import { Game } from "./game";
import { User_Game } from "./user_game";

@Entity()
export abstract class Card {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Actor, actor => actor.cards)
  @JoinTable()
  actors: Actor[];

  @OneToMany(() => Card_Content, card_content => card_content.card)
  contents: Card_Content[];

  @ManyToMany(() => Game, game => [game.deck_stack, game.discard_stack])
  games: Game[]

  @ManyToMany(() => User_Game, user_game => user_game.cards_stack)
  @JoinTable()
  cards_stack_users_game: User_Game[]
}
