import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginAuthModule } from './login-auth/login-auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTableModule } from './create-table/create-table.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mysql', 
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10 ),
    username: 'Daniel',
    password: process.env.DB_PASSWORD,
    database: 'BingoElGranBuda',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false, 
  }),LoginAuthModule, CreateTableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
