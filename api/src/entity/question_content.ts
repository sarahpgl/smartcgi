import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question";

@Entity()
export class Question_Content {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    question_id : number;

    @OneToMany(() => Question, (question) => question.question_contents)
    question: Question;

    @Column({nullable: false})
    language: string;

    @Column({nullable: false})
    label: string;

    @Column({nullable: false})
    description: string;
}