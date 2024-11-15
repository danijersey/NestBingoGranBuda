import { Test, TestingModule } from '@nestjs/testing';
import { LoginAuthService } from './login-auth.service';
import { LoginAuthRepository } from './repositorys/login-auth.repository';
import { LoginAuthDto } from './dto/create-login-auth.dto';

// Mock del repositorio LoginAuthRepository
const mockLoginAuthRepository = {
  AuthLogin: jest.fn(),
};

describe('LoginAuthService', () => {
  let service: LoginAuthService;
  let loginAuthRepository: LoginAuthRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginAuthService,
        {
          provide: LoginAuthRepository,
          useValue: mockLoginAuthRepository,
        },
      ],
    }).compile();

    service = module.get<LoginAuthService>(LoginAuthService);
    loginAuthRepository = module.get<LoginAuthRepository>(LoginAuthRepository);
  });

  describe('LoginUser', () => {
    it('should return a user if login is successful', async () => {
      const loginData: LoginAuthDto = { UserName: 'testuser', Password: 'password123' };
      const mockUser = { id: 1, username: 'testuser', token: 'fake-jwt-token' };
      
      // Simulamos que AuthLogin retorna un usuario
      mockLoginAuthRepository.AuthLogin.mockResolvedValue(mockUser);

      const result = await service.LoginUser(loginData);

      expect(loginAuthRepository.AuthLogin).toHaveBeenCalledWith(loginData); // Verifica que AuthLogin fue llamado con los datos correctos
      expect(result).toEqual(mockUser); // Verifica que el resultado sea el esperado
    });

    it('should throw an error if login fails', async () => {
      const loginData: LoginAuthDto = { UserName: 'wronguser', Password: 'wrongpassword' };
      
      // Simulamos que AuthLogin falla y lanza un error
      mockLoginAuthRepository.AuthLogin.mockRejectedValue(new Error('Invalid credentials'));

      try {
        await service.LoginUser(loginData);
      } catch (error) {
        expect(error.message).toBe('Invalid credentials'); // Verifica que el error sea el esperado
      }
    });
  });
});
