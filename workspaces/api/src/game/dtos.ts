import { PracticeAnswer } from '@shared/common/Game';
import { CardType } from '@shared/common/Cards';
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class LobbyCreateDto {
  @IsString()
  playerName: string;

  @IsNumber()
  co2Quantity: number;
}

export class LobbyJoinDto {
  @IsString()
  connectionCode: string;

  @IsOptional()
  @IsString()
  clientInGameId: string;

  @IsString()
  playerName: string;
}

export class ClientStartGameDto {
  @IsString()
  clientInGameId: string;
}

export class PracticeAnswerDto {
  @IsString()
  cardId: string;

  @IsString()
  answer: PracticeAnswer;

  cardType: CardType;
}

export class ClientReconnectDto {
  @IsString()
  clientToken: string;

  @IsString()
  clientInGameId: string;

  // See later if this will be useful, on how we can send back messages to the disconnect/reconnect client
  @IsNumber()
  lastMessageReceived: number;
}
