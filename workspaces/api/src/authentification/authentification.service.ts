
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private validTokens: Map<string, string> = new Map();
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(
    mail: string,
    pass: string,
  ): Promise<{ access_token: string }> {

    const user = await this.usersService.findOne(mail);
    if (!user) {
      throw new UnauthorizedException('Invalid mail');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { sub: user.id, mail: user.mail };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '2h' });
    this.validTokens.set(token, user.mail);
    return {
      access_token: token,
    };
  }

  async signUp(
    mail: string,
    password: string,
    lastname: string,
    firstname: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Vérifiez si l'utilisateur existe déjà
      const existingUser = await this.usersService.findOne(mail);
      if (existingUser) {
        return { success: false, message: 'Mail already exists' };
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
      return { success: false, message: 'An error occurred while creating the user' };
    }
  }

  async signOut(token: string): Promise<{ success: boolean }> {
    try {

      this.validTokens.delete(token);
      return { success: true }
    }
    catch {
      throw new Error('deconnection failed');
    }
  }


  async isConnected(access_token: string): Promise<{ success: boolean }> {

    let valid = this.validTokens.get(access_token)
    if (valid) {
      console.log("not connected")
      return { success: false };
    } else {
      console.log("connected")
      return { success: true };
    }

  }

}


