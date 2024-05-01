import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dtos';


@Controller('users')
export class UsersController {
    constructor(private usersService : UsersService){}
    @HttpCode(HttpStatus.OK)
    @Get('/getBooklet')
    getBooklet(@Body() usersDto: UsersDto){
        return this.usersService.getBooklet((parseInt( usersDto.user_id)));
    
    }
}

