import { UpdateTodoDto, TodoResponseDto } from "../dto/TodoDto";
import { TodoRepository } from "../ports/TodoRepository";

// src/core/application/use-cases/UpdateTodoUseCase.ts
export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string, dto: UpdateTodoDto): Promise<TodoResponseDto> {
    // 1. Récupérer la todo existante
    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      throw new Error('Todo non trouvée');
    }

    // 2. Appliquer les modifications (logique métier)
    let updatedTodo = existingTodo;
    
    if (dto.title !== undefined) {
      updatedTodo = updatedTodo.updateTitle(dto.title);
    }
    
    if (dto.description !== undefined) {
      updatedTodo = updatedTodo.updateDescription(dto.description);
    }
    
    if (dto.priority !== undefined) {
      updatedTodo = updatedTodo.updatePriority(dto.priority);
    }

    // 3. Sauvegarder
    await this.todoRepository.update(id, updatedTodo);

    // 4. Retourner DTO
    return {
      id: updatedTodo.id,
      title: updatedTodo.title,
      description: updatedTodo.description,
      completed: updatedTodo.completed,
      priority: updatedTodo.priority,
      createdAt: updatedTodo.createdAt.toISOString(),
      updatedAt: updatedTodo.updatedAt.toISOString()
    };
  }
}