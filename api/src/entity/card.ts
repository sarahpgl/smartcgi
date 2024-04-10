import { Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Actor } from "./actor";
import { Card_Content } from "./card_content";

@Entity()
export abstract class Card {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Actor)
  actors: Actor[];

  @OneToMany(() => Card_Content, card_content => card_content.card_id)
  contents: Card_Content[];
}
