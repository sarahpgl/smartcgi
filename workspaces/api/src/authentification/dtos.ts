import {IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto
{
  @IsString()
  mail: string ;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}

export class SignUpDto
{
  @IsString()
  mail: string ;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  lastname: string;

  @IsString()
  firstname: string;
}
