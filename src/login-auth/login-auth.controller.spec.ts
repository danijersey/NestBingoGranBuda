import { Test, TestingModule } from '@nestjs/testing';
import { LoginAuthController } from './login-auth.controller';
import { LoginAuthService } from './login-auth.service';
import { LoginAuthDto } from './dto/create-login-auth.dto';

// Mock del servicio LoginAuthService
const mockLoginAuthService = {
  LoginUser: jest.fn(),
};

describe('LoginAuthController', () => {
  let controller: LoginAuthController;
  let service: LoginAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginAuthController],
      providers: [
        {
          provide: LoginAuthService,
          useValue: mockLoginAuthService,
        },
      ],
    }).compile();

    controller = module.get<LoginAuthController>(LoginAuthController);
    service = module.get<LoginAuthService>(LoginAuthService);
  });

  describe('LoginUser', () => {
    it('should return a user if login is successful', async () => {
      const loginData: LoginAuthDto = { UserName: 'testuser', Password: 'password123' };
      const mockUser = { id: 1, username: 'testuser', token: 'fake-jwt-token' };

      // Simulamos que LoginUser en el servicio devuelve un usuario
      mockLoginAuthService.LoginUser.mockResolvedValue(mockUser);

      const result = await controller.LoginUser(loginData);

      // Verificamos que LoginUser fue llamado con los datos correctos
      expect(service.LoginUser).toHaveBeenCalledWith(loginData);
      // Verificamos que la respuesta es la esperada
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if login fails', async () => {
      const loginData: LoginAuthDto = { UserName: 'wronguser', Password: 'wrongpassword' };

      // Simulamos que LoginUser en el servicio lanza un error
      mockLoginAuthService.LoginUser.mockRejectedValue(new Error('Invalid credentials'));

      try {
        await controller.LoginUser(loginData);
      } catch (error) {
        // Verificamos que el error sea el esperado
        expect(error.message).toBe('Invalid credentials');
      }
    });
  });
});
