import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { RegisterDto } from '../dto/auth.dto'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  register = async (req: Request, res: Response) => {
    try {
      const registerDto: RegisterDto = req.body
      const result = await this.authService.register(registerDto)
      res.status(201).json(result)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      const result = await this.authService.login(email, password)
      res.json(result)
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
  }
} 