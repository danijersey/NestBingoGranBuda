import { Module } from '@nestjs/common';
import { CreateTableController } from './create-table.controller';
import { TableService } from './create-table.service';
import { BingoGateway } from './bingo.gateway';
import { ListaGanadoresRepository } from './repositories/ListaGanadores.repository';

@Module({
  controllers: [CreateTableController],
  providers: [TableService,BingoGateway,ListaGanadoresRepository]
})
export class CreateTableModule {}
