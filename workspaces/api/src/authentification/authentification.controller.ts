
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './authentification.service';
import { SignInDto } from './dtos';
import { SignUpDto } from './dtos';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
    
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.mail, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.mail, signUpDto.password, signUpDto.lastname, signUpDto.firstname);
  }

}
