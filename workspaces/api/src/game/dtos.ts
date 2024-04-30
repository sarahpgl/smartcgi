import { PracticeAnswerType } from '@shared/common/Game';
import { IsNumber, IsString } from 'class-validator';
export class LobbyCreateDto
{
  @IsString()
  playerName: string;

  @IsNumber()
  co2Quantity: number;
}

export class LobbyJoinDto
{
  @IsString()
  connectionCode: string;

  @IsString()
  playerName: string;
}

export class PracticeAnswerDto
{
  @IsString()
  cardId: string;

  @IsString()
  answer: PracticeAnswerType;
}
