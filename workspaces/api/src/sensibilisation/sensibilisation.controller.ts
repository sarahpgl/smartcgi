import { Controller, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SensibilisationService } from './sensibilisation.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Question } from '@app/entity/question';

@Controller('sensibilisation')
export class SensibilisationController {
    constructor(private sensibilisationService : SensibilisationService){}
    
    @Post('/csv')
    @UseInterceptors(FileInterceptor('csvFile'))
    async createFromCsv(@UploadedFile() csvFile : Express.Multer.File, @Res() res: Response){
        try {
            console.log(csvFile)
            const cards =  await this.sensibilisationService.parseCsv(csvFile);
            return res.status(200).json({ok: true, data: cards});
        } catch(error){
            console.error(error);
        }
    }
}

