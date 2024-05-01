import { Controller, Get, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CardService } from './card.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Card } from '@shared/common/Cards';
import { Best_Practice_Card } from '@app/entity/best_practice_card';

@Controller('card')
export class CardController {

    constructor(private cardService: CardService){}

    @Post('csv')
    @UseInterceptors(FileInterceptor('csvFile'))
    async createFromCsv(@UploadedFile() csvFile : Express.Multer.File, @Res() res: Response){
        try {
            console.log(csvFile)
            const cards =  await this.cardService.parseCsv(csvFile);
            return res.status(200).json({ok: true, data: cards});
        } catch(error){
            console.error(error);
        }
    }

    @Get('deck')
    async getDeck(): Promise<Card[]> {
        console.log('get deck');
        return this.cardService.getDeck();
    }

    @Get('deck')
    async getDeck(): Promise<Card[]> {
        console.log('get deck');
        return this.cardService.getDeck();
    }

    @Get('bad-practice')
    async getBadPractice(){
        console.log('get bad practice');
        return this.cardService.getBadPracticeCard();
    }
}
