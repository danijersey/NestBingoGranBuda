import { Test, TestingModule } from '@nestjs/testing';
import { TableService } from './create-table.service';
import { ListaGanadoresRepository } from './repositories/ListaGanadores.repository';

describe('TableService', () => {
  let service: TableService;
  let listaGanadoresRepository: ListaGanadoresRepository;

  // Mock del repositorio ListaGanadoresRepository
  const mockListaGanadoresRepository = {
    SaveUserWin: jest.fn(),
    GetListWinUsers: jest.fn().mockResolvedValue(['user1', 'user2', 'user3']), // mock de la función asincrónica
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableService,
        {
          provide: ListaGanadoresRepository,
          useValue: mockListaGanadoresRepository,
        },
      ],
    }).compile();

    service = module.get<TableService>(TableService);
    listaGanadoresRepository = module.get<ListaGanadoresRepository>(ListaGanadoresRepository);
  });

  describe('GenerateTable', () => {
    it('should generate a valid 5x5 bingo table', () => {
      const table = service.GenerateTable();
      expect(table).toHaveLength(1); // Un solo array
      expect(table[0]).toHaveLength(5); // 5 filas
      expect(table[0][2]).toContain(null); // La fila 2 debe contener un null en la posición central
      expect(new Set(table[0].flat()).size).toBe(25); // No debe haber números repetidos en la tabla
    });
  });

  describe('ValidationBingo', () => {
    it('should return true for a valid diagonal bingo', () => {
      const bingoData:any = [1, 2, 3, 4, 5]; // Números seleccionados para la diagonal
      const table:any = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25],
      ];

      const result = service.ValidationBingo(bingoData, table);
      expect(result).toBe(true);
    });

    it('should return false for an invalid bingo', () => {
      const bingoData:any = [1, 2, 3, 4, 6]; // Números seleccionados que no forman un bingo
      const table = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25],
      ];

      const result = service.ValidationBingo(bingoData, table);
      expect(result).toBe(false);
    });
  });

  describe('SaveUserWin', () => {
    it('should call SaveUserWin with the correct username', async () => {
      const username = 'testuser';
      await service.SaveUserWin(username);
      expect(listaGanadoresRepository.SaveUserWin).toHaveBeenCalledWith(username);
    });
  });

  describe('GetListWinUsers', () => {
    it('should return an array of winning users', async () => {
      const result = await service.GetListWinUsers();
      expect(result).toEqual(['user1', 'user2', 'user3']);
    });
  });
});
