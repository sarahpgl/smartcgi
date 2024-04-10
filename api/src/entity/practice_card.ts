import { Column } from "typeorm";
import { Card } from "./card";

export enum Difficulty {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
}

export class Practice_Card extends Card {

    @Column({nullable: false})
    network_gain: boolean;

    @Column({nullable: false})
    memory_gain: boolean;

    @Column({nullable: false})
    cpu_gain: boolean;

    @Column({nullable: false})
    storage_gain: boolean;

    @Column({ type: 'enum', enum: Difficulty, default: Difficulty.ONE }) 
    difficulty: Difficulty;

}