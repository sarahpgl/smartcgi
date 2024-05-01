import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { BookletService } from './booklet.service';
import { BookletDto } from './dtos';

@Controller('booklet')
export class BookletController {
    constructor(private bookletService: BookletService){}
    @HttpCode(HttpStatus.OK)
    @Post('/create')
    createBooklet(@Body() bookletDto: BookletDto){
        return this.bookletService.createBooklet(parseInt(bookletDto.user_id));
    }
    
}