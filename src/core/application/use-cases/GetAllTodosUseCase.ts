import { TodoListResponseDto, TodoResponseDto } from "../dto/TodoDto";
import { TodoRepository } from "../ports/TodoRepository";

// src/core/application/use-cases/GetAllTodosUseCase.ts
export class GetAllTodosUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(): Promise<TodoListResponseDto> {
    const todos = await this.todoRepository.findAll();
    
    const todoResponses: TodoResponseDto[] = todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      priority: todo.priority,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString()
    }));

    const completed = todos.filter(todo => todo.completed).length;
    const pending = todos.length - completed;

    return {
      todos: todoResponses,
      total: todos.length,
      completed,
      pending
    };
  }
}