import { Request, Response } from 'express';
import { AuthController } from '../auth.controller';
import { AuthService } from '../../services/auth.service';
import { RegisterDto } from '../../dto/auth.dto';

jest.mock('../../services/auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockAuthService = new AuthService() as jest.Mocked<AuthService>;
    authController = new AuthController();
    
    authController['authService'] = mockAuthService;
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'rafael@gmail.com',
        password: 'password123',
        name: 'Rafael',
      };

      mockRequest.body = registerDto;
      const mockUser = {
        id: 1,
        email: registerDto.email,
        name: registerDto.name,
        createdAt: new Date(),
      };
      
      mockAuthService.register.mockResolvedValue(mockUser);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle registration error', async () => {
      const registerDto: RegisterDto = {
        email: 'rafael@gmail.com',
        password: 'password123',
        name: 'Rafael',
      };

      mockRequest.body = registerDto;
      const error = new Error('User already exists');
      mockAuthService.register.mockRejectedValue(error);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
}); 