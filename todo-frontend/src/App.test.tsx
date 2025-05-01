import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders sign in form', () => {
    render(<App />)
    const signInText = screen.getByText(/Sign in to your account/i)
    expect(signInText).toBeInTheDocument()
  })
})
