import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export class ValidationBingoDto{
    @IsArray()
    @ArrayNotEmpty()
    data: number[][][];
    @IsArray()
    array:[]

    @IsString()
    username:string;
}