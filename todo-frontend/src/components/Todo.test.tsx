import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Todo from './Todo'

describe('Todo Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    completed: false,
    createdAt: new Date().toISOString()
  }

  const mockOnToggle = vi.fn()
  const mockOnDelete = vi.fn()

  it('renders todo item correctly', () => {
    render(
      <Todo
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const todoTitle = screen.getByText('Test Todo')
    expect(todoTitle).toBeInTheDocument()
  })

  it('calls onToggle when checkbox is clicked', () => {
    render(
      <Todo
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(mockOnToggle).toHaveBeenCalledWith(mockTodo.id)
  })

  it('calls onDelete when delete button is clicked', () => {
    render(
      <Todo
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    expect(mockOnDelete).toHaveBeenCalledWith(mockTodo.id)
  })
}) 