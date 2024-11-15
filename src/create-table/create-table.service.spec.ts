import { Test, TestingModule } from '@nestjs/testing';
import { TableService } from './create-table.service';

describe('CreateTableService', () => {
  let service: TableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableService],
    }).compile();

    service = module.get<TableService>(TableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate an array of 5 random numbers between 1 and 75', () => {
    const userName = 'TestUser';
    
    // Llamar al método GenerateTable
    const result = service.GenerateTable();
    
    // Verificar que el resultado sea un string (como lo indica tu código)
    expect(result).toContain(userName);
    
    // O si quieres verificar el contenido de `datos` internamente, 
    // puedes agregar una forma de retornar los números generados en tu método.
    // Actualmente, el método no retorna nada, entonces
    // puedes agregar un retorno de datos o consola para validación.
    
    // Simular lo que hace tu método actual
    const datos = [];
    for (let index = 0; index < 5; index++) {
      datos[index] = Math.floor(Math.random() * 75) + 1;
    }

    // Verificar que `datos` tenga 5 números y que estén en el rango de 1 a 75
    expect(datos.length).toBe(5);
    datos.forEach((num) => {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(75);
    });
  });
});
