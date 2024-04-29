
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

    async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { sub: user.id, mail: user.mail };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    mail: string, 
    password: string, 
    lastname: string, 
    firstname: string
  ): Promise<{ success: boolean }> {
    try {
      // Vérifiez si l'utilisateur existe déjà

      const existingUser = await this.usersService.findOne(mail);
      if (existingUser) {
        throw new Error('Username already exists');
      }
      // Hash du mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // Création de l'utilisateur dans la base de données avec le mot de passe hashé
      await this.usersService.createUser(mail, hashedPassword, lastname, firstname);
      console.log('User created');

      return { success: true };

    } catch (error) {

      console.error('Error creating user:', error.message);
      return { success: false };
    }
  }

}


