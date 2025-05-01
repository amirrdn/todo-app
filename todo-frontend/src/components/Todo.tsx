import React from 'react'
import { Checkbox, Button, Box, Text } from '@chakra-ui/react'

interface TodoProps {
  todo: {
    id: number
    title: string
    completed: boolean
    createdAt: string
  }
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

const Todo: React.FC<TodoProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={4}
      borderWidth="1px"
      borderRadius="md"
      mb={2}
    >
      <Box display="flex" alignItems="center">
        <Checkbox
          isChecked={todo.completed}
          onChange={() => onToggle(todo.id)}
          mr={4}
        />
        <Text
          textDecoration={todo.completed ? 'line-through' : 'none'}
          color={todo.completed ? 'gray.500' : 'inherit'}
        >
          {todo.title}
        </Text>
      </Box>
      <Button
        colorScheme="red"
        size="sm"
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </Button>
    </Box>
  )
}

export default Todo 