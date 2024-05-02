import {IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
export class BookletDto
{
    @IsString()
    user_id: string ;
}