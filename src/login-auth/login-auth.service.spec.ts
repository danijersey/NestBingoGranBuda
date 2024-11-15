import { Test, TestingModule } from '@nestjs/testing';
import { LoginAuthService } from './login-auth.service';
import { LoginAuthDto } from './dto/create-login-auth.dto';

describe('LoginAuthService', () => {
  let service: LoginAuthService;

  beforeEach(async () => {
    // Configuramos el módulo de prueba
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginAuthService], // Proveemos el servicio que vamos a testear
    }).compile();

    // Obtenemos la instancia del servicio
    service = module.get<LoginAuthService>(LoginAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined(); // Aseguramos que el servicio esté definido
  });

  describe('LoginUser', () => {
    it('should return a login message', () => {
      const loginAuthDto: LoginAuthDto = { UserName: 'user', Password: 'password' }; // Creamos un DTO de ejemplo
      const result = service.LoginUser(loginAuthDto); // Llamamos al método LoginUser

      // Verificamos que el resultado sea el esperado
      expect(result).toBe('This action returns a user,password loginAuth');
    });
  });
});
