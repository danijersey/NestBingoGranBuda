import { Injectable } from '@nestjs/common';
import { Console, log } from 'console';
import { response } from 'express';
import { Index } from 'typeorm';
import { ValidationBingoDto } from './dto/ValidationBingodto';
import { ListaGanadoresRepository } from './repositories/ListaGanadores.repository';

@Injectable()
export class TableService {
    
    constructor(
        private ListaGanadoresRepository:ListaGanadoresRepository
    ){
       
    }
    GenerateTable() {
        let tabla = [];
        let datosRetorno=[]
        let availableNumbers = Array.from({ length: 75 }, (_, index) => index + 1);//genero el array de 1-75
    
        for (let l = 0; l < 5; l++) {
            let datos = [];
            // Para cada fila, selecciono 5 números sin repetirlos
            for (let index = 0; index < 5; index++) {
    
                // colocar null en la mitad por punto extralla
                if (index === 2 && l === 2) {
                    datos.push(null);
                    continue;
                }
    
                // Elegir un número aleatorio para la tabla
                const randomIndex = Math.floor(Math.random() * availableNumbers.length);
                const randomNumber = availableNumbers.splice(randomIndex, 1)[0];
                datos.push(randomNumber);
            }
    
            // Agregar la fila a la tabla
            tabla.push(datos);
        }
        datosRetorno.push(tabla)
        console.log(datosRetorno); // tabla completa de 5x5

        return datosRetorno;
    }

    ValidationBingo(data:[],Tablon:number[][]){

        let Tabla=Tablon;
        let DatosSelecccion=data;
                            //5 metodos de confirmacion//
       let ResponseDiagonal = this.ConfirmDiagonal(Tabla,DatosSelecccion)
             console.log(ResponseDiagonal,'diagonal')

        let ResponseVertical = this.ConfirmVertical(Tabla,DatosSelecccion)
         console.log(ResponseVertical,'vertical')

        let RespondeHorizontal = this.ConfirmHorizontal(Tabla,DatosSelecccion)
        console.log(RespondeHorizontal,'Horizontal')

        let ResponseEsquina = this.ConfirmEsquinas(Tabla,DatosSelecccion)
        console.log(ResponseEsquina,'esquinas')

        let ResponseComplete =this.ConfirmComplete(Tabla,DatosSelecccion)
        console.log(ResponseComplete,'completo')

        if(ResponseDiagonal || ResponseVertical || RespondeHorizontal
          || ResponseEsquina   || ResponseComplete){
            const response = true;
            console.log('felicidades')
            return response;
        }else{
            const response = false;
            console.log('muy mal Descalificado')
            return response;
        }
    }

    ConfirmDiagonal(recibirtabla:number[][],recibirDatosSelect:number[]){
        const principalDiagonal = [0, 1, 3, 4].every(index => 
            recibirDatosSelect.includes(recibirtabla[index][index])
        );

        // Verificar diagonal secundaria (de [0][4] a [4][0])
        const secondaryDiagonal = [0, 1, 3, 4].every(index => 
            recibirDatosSelect.includes(recibirtabla[index][4 - index])
        );

        return principalDiagonal || secondaryDiagonal;
    }
    
    ConfirmVertical(recibirtabla: number[][], recibirDatosSelect: number[]): boolean {
        let respuesta = false;

        for (let col = 0; col < 5; col++) {
            if (col === 2) {
                // Para la columna 2 (tercera columna), verificamos solo 4 filas (0, 1, 3, 4)
                const columnaCompleta = [0, 1, 3, 4].every(fila =>
                    recibirDatosSelect.includes(recibirtabla[fila][col])
                );
    
                if (columnaCompleta) {
                    console.log("Columna 2 (tercera) completada con 4 valores");
                    respuesta = true;
                    break; 
                }
            } else {
                // Para las demás columnas (0, 1, 3, 4), verificamos todas las filas (0, 1, 2, 3, 4)
                const columnaCompleta = [0, 1, 2, 3, 4].every(fila =>
                    recibirDatosSelect.includes(recibirtabla[fila][col])
                );
    
                if (columnaCompleta) {
                    console.log(`Columna ${col} completada con 5 valores`);
                    respuesta = true;
                    break; 
                }
            }
        }
    
        console.log(respuesta ? "Se encontró una columna completa" : "No se encontró ninguna columna completa");
        return respuesta;
    }
    

    ConfirmHorizontal(recibirtabla: number[][], recibirDatosSelect: number[]): boolean {
        let respuesta = false; 
 
        for (let fila = 0; fila < recibirtabla.length; fila++) {
            if (fila === 2) {
                const respuestaCuatro = [0, 1, 3, 4].every(Index =>
                    recibirDatosSelect.includes(recibirtabla[fila][Index])
                );
    
                if (respuestaCuatro) {
                    console.log("Se encontró coincidencia de cuatro valores en la fila 2 (excluyendo la columna central)");
                    respuesta = true;
                    break; 
                }
            } else {
                // Para las demás filas, verificamos todas las columnas (0, 1, 2, 3, y 4)
                const respuestaCinco = [0, 1, 2, 3, 4].every(Index =>
                    recibirDatosSelect.includes(recibirtabla[fila][Index])
                );
    
                if (respuestaCinco) {
                    console.log(`Se encontró coincidencia de cinco valores en la fila ${fila}`);
                    respuesta = true;
                    break;
                }
            }
        }
    
        console.log(respuesta ? "Se encontró una fila completa" : "No se encontró ninguna fila completa");
        return respuesta;
    }
    
    ConfirmEsquinas(recibirtabla: number[][], recibirDatosSelect: number[]): boolean {
        // Array con las posiciones de las esquinas
        const esquinas = [
            recibirtabla[0][0],  // Esquina superior izquierda
            recibirtabla[0][4],  // Esquina superior derecha
            recibirtabla[4][0],  // Esquina inferior izquierda
            recibirtabla[4][4]   // Esquina inferior derecha
        ];
    
        // Verificar que todas las esquinas están incluidas en recibirDatosSelect
        const respuesta = esquinas.every(esquina => recibirDatosSelect.includes(esquina));
    
        console.log(respuesta ? "Todas las esquinas están seleccionadas" : "No se seleccionaron todas las esquinas");
        
        return respuesta;
    }

    ConfirmComplete(recibirtabla: number[][], recibirDatosSelect: number[]): boolean {
        // Recorre cada fila de la tabla
        const respuesta = recibirtabla.every(row => 
            // Verifica que cada valor de la fila esté en recibirDatosSelect
            row.every(value => value === null || recibirDatosSelect.includes(value))
            //value ===null es para que ignore los espacios null de la tabla
        );
    
        console.log(respuesta ? "Todos los números están seleccionados" : "No todos los números están seleccionados");
        return respuesta;
    }

    async SaveUserWin(username:string){
          return  await this.ListaGanadoresRepository.SaveUserWin(username)
    }

    async GetListWinUsers(){
        return await this.ListaGanadoresRepository.GetListWinUsers()
    }


}
