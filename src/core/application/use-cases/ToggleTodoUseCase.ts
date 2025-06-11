import { TodoResponseDto } from "../dto/TodoDto";
import { TodoRepository } from "../ports/TodoRepository";

// src/core/application/use-cases/ToggleTodoUseCase.ts
export class ToggleTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string): Promise<TodoResponseDto> {
    // 1. Récupérer la todo
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo non trouvée');
    }

    // 2. Toggle (logique métier)
    const toggledTodo = todo.completed ? todo.markAsIncomplete() : todo.markAsCompleted();

    // 3. Sauvegarder
    await this.todoRepository.update(id, toggledTodo);

    // 4. Retourner DTO
    return {
      id: toggledTodo.id,
      title: toggledTodo.title,
      description: toggledTodo.description,
      completed: toggledTodo.completed,
      priority: toggledTodo.priority,
      createdAt: toggledTodo.createdAt.toISOString(),
      updatedAt: toggledTodo.updatedAt.toISOString()
    };
  }
}