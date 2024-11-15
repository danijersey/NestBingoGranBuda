import { DataSource, Repository } from "typeorm";
import { ListaGanadoresEntity } from "../entity/GanadoresBingo.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ListaGanadoresRepository extends Repository<ListaGanadoresEntity>{

    constructor(private datasource:DataSource){
        super(ListaGanadoresEntity, datasource.createEntityManager())
    }

    async GetListWinUsers(){
        return await this.find()
    }

    async SaveUserWin(username:string){
        let repositorio = new ListaGanadoresEntity;
        repositorio.username=username;
        repositorio.save()
        return await repositorio;
    }

}