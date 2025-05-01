import { AuthService } from '../services/auth.service'
import { describe, it, expect, beforeEach } from '@jest/globals'

describe('Auth Service', () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService()
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  it('should have register method', () => {
    expect(authService.register).toBeDefined()
  })

  it('should have login method', () => {
    expect(authService.login).toBeDefined()
  })
}) 