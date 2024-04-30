import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question";

@Entity()
export class Question_Answer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    question_id: number;

    @ManyToOne(() => Question, (question) => question.question_answers)
    question: Question;

    @Column({nullable: false})
    language: string;

    @Column({nullable: false})
    answer: number;

    @Column({nullable: false})
    is_good_answer: boolean;
    
}