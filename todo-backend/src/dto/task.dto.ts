export interface CreateTaskDto {
  title: string
  description: string
  userId: number
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  completed?: boolean
}
