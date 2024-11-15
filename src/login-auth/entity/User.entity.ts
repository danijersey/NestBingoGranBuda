import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    UserName:string;
    
    @Column()
    Password: string;

    @Column()
    Token:string;


}