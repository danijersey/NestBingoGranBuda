import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../entity/User.entity";
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { LoginAuthDto } from "../dto/create-login-auth.dto";

@Injectable()
export class LoginAuthRepository extends Repository<UserEntity>{

    constructor(datasource:DataSource){
        super(UserEntity, datasource.createEntityManager())
    }

    
    async AuthLogin(DataUserLogin:LoginAuthDto){
        try{       
        let {UserName,Password} = DataUserLogin
        const result = await this.findOne({where:{UserName:UserName,Password:Password}})    
        
            if(result){
                return await result;
             }
            else{
                throw new HttpException('No se encontro el usuario',HttpStatus.NOT_FOUND)
            }

        }catch{
        throw new HttpException('No se encontro el usuario',HttpStatus.NOT_FOUND)
        }
    }

}