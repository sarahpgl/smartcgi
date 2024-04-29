
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
  ) {}

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
    const token = await this.jwtService.signAsync(payload,  { expiresIn: '2h' });
    this.validTokens.set(token, user.mail);
    return {
      access_token: token ,
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
        throw new Error('mail already exists');
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

   async signOut(token: string) : Promise<{ success: boolean }>  {
    try {
        
        this.validTokens.delete(token);
        return {success :true}
    }
    catch{
        throw new Error('deconnection failed'); 
    }
    }

     
    async isConnected(mail : string) :  Promise<{ success: boolean }> {
        try{
            
            for (const [key, value] of this.validTokens) {
                
                
                if (value == mail) {
                    
                    return {success :true}; // Retourne le string associé au token
                }
            }
            console.log("not connected")
            return {success :false};
             
        }
        catch{
            console.error('user not connected:')
            return {success :false};

        }
       
        
    }
  
}


