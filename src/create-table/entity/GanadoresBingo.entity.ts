import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ListaGanadoresEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    username:string


}