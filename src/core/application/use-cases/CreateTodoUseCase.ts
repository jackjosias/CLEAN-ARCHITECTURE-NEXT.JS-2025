import { CreateTodoDto, TodoResponseDto } from "../dto/TodoDto";
import { TodoRepository } from "../ports/TodoRepository";
import { Todo } from "../../domain/entities/Todo";

// src/core/application/use-cases/CreateTodoUseCase.ts
export class CreateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(dto: CreateTodoDto): Promise<TodoResponseDto> {
    // 1. Créer l'entité Todo (logique métier)
    const todo = Todo.create(dto.title, dto.description, dto.priority);

    // 2. Sauvegarder
    await this.todoRepository.save(todo);

    // 3. Retourner DTO
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      priority: todo.priority,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString()
    };
  }
}