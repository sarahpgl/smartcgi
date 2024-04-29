
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './authentification.service';
import { SignInDto } from './dtos';
import { SignUpDto } from './dtos';
import { SignOutDto } from './dtos';
import { isConnectedDto } from './dtos';
 
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

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signOut(@Body() signOutDto: SignOutDto) {
    return this.authService.signOut(signOutDto.token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('testAccess')
  testAccess(@Body() isConnectedDto: isConnectedDto) {
    return this.authService.isConnected(isConnectedDto.mail);
  }
}
