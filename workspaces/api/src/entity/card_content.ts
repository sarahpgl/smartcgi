import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Card } from "./card";

@Entity()
export class Card_Content{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Card, (card) => card.contents)
    card: Card;

    @Column({nullable: false})
    card_id : number;

    @Column({nullable: false})
    language: string;

    @Column({nullable: false})
    label: string;
    
    @Column({nullable: false})
    description: string;
}