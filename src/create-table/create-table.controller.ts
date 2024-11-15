import { Body, Controller, Get, Post } from '@nestjs/common';
import { TableService } from './create-table.service';
import { CreateTableDto } from './dto/create-table.dto';
import {  ValidationBingoDto } from './dto/ValidationBingodto';
import { BingoGateway } from './bingo.gateway';

@Controller('create-table')
export class CreateTableController {

    constructor(
        private TableService:TableService,
        private readonly bingoGateway: BingoGateway
    ){

    }
    @Get('')
    async CreateTable(){
       return  await this.TableService.GenerateTable()
    }

    @Get('/lista')
    async GetListWinUsers(){        
       return await this.TableService.GetListWinUsers()
    }
    @Post('/verificar')
    async ConfirmTable(@Body() data:ValidationBingoDto){
        const Tabla = data.data.flat()
        const isWinner = await this.TableService.ValidationBingo(data.array,Tabla)
        
        if (isWinner) {
            this.TableService.SaveUserWin(data.username)
            this.bingoGateway.notifyAllPlayers(`¡tenemos un ganador ! ${data.username}`);
          }
          return isWinner;
    }    
}
