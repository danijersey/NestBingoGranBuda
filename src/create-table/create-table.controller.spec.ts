import { Test, TestingModule } from '@nestjs/testing';
import { CreateTableController } from './create-table.controller';
import { TableService } from './create-table.service';
import { BingoGateway } from './bingo.gateway';
import { ValidationBingoDto } from './dto/ValidationBingodto';

// Mock de las dependencias
const mockTableService = {
  GenerateTable: jest.fn(),
  GetListWinUsers: jest.fn(),
  ValidationBingo: jest.fn(),
  SaveUserWin: jest.fn(),
};

const mockBingoGateway = {
  notifyAllPlayers: jest.fn(),
};

describe('CreateTableController', () => {
  let controller: CreateTableController;
  let tableService: TableService;
  let bingoGateway: BingoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateTableController],
      providers: [
        {
          provide: TableService,
          useValue: mockTableService,
        },
        {
          provide: BingoGateway,
          useValue: mockBingoGateway,
        },
      ],
    }).compile();

    controller = module.get<CreateTableController>(CreateTableController);
    tableService = module.get<TableService>(TableService);
    bingoGateway = module.get<BingoGateway>(BingoGateway);
  });

  describe('CreateTable', () => {
    it('should return a generated bingo table', async () => {
      const mockTable = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]];
      mockTableService.GenerateTable.mockResolvedValue([mockTable]);

      const result = await controller.CreateTable();
      
      expect(tableService.GenerateTable).toHaveBeenCalled();
      expect(result).toEqual([mockTable]);
    });
  });

  describe('GetListWinUsers', () => {
    it('should return a list of winning users', async () => {
      const mockWinningUsers = ['user1', 'user2', 'user3'];
      mockTableService.GetListWinUsers.mockResolvedValue(mockWinningUsers);

      const result = await controller.GetListWinUsers();

      expect(tableService.GetListWinUsers).toHaveBeenCalled();
      expect(result).toEqual(mockWinningUsers);
    });
  });

  describe('ConfirmTable', () => {
    it('should call ValidationBingo and notify players if there is a winner', async () => {
      const mockData: ValidationBingoDto = {
        username: 'testuser',
        array: [1, 2, 3, 4, 5] as unknown as [], // Forzamos el tipo aquí
        // Asegúrate de que "data" sea correctamente tipado como `number[][]`
        data: [[
          [1, 2, 3, 4, 5],
          [6, 7, 8, 9, 10],
          [11, 12, 13, 14, 15],
          [16, 17, 18, 19, 20],
          [21, 22, 23, 24, 25]
        ]] as number[][][],  // Asegúrate de que "data" es un array de arrays de números
      };

      mockTableService.ValidationBingo.mockResolvedValue(true);

      const result = await controller.ConfirmTable(mockData);

      expect(tableService.ValidationBingo).toHaveBeenCalledWith(mockData.array, mockData.data.flat());
      expect(tableService.SaveUserWin).toHaveBeenCalledWith(mockData.username);
      expect(bingoGateway.notifyAllPlayers).toHaveBeenCalledWith(`¡tenemos un ganador! ${mockData.username}`);
      expect(result).toBe(true);
    });

    it('should return false if there is no winner', async () => {
      const mockData: ValidationBingoDto = {
        username: 'testuser',
        array: [1, 2, 3, 4, 5] as unknown as [], // Forzamos el tipo aquí
        // Asegúrate de que "data" sea correctamente tipado como `number[][]`
        data: [[
          [1, 2, 3, 4, 5],
          [6, 7, 8, 9, 10],
          [11, 12, 13, 14, 15],
          [16, 17, 18, 19, 20],
          [21, 22, 23, 24, 25]
        ]] as number[][][],  // Asegúrate de que "data" es un array de arrays de números
      };

      mockTableService.ValidationBingo.mockResolvedValue(false);

      const result = await controller.ConfirmTable(mockData);

      expect(tableService.ValidationBingo).toHaveBeenCalledWith(mockData.array, mockData.data.flat());
      expect(tableService.SaveUserWin).not.toHaveBeenCalled();
      expect(bingoGateway.notifyAllPlayers).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
