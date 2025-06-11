import { TodoRepository } from "../ports/TodoRepository";
import { TodoDomainService } from "../../domain/services/TodoDomainService";

// src/core/application/use-cases/DeleteTodoUseCase.ts
export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Récupérer la todo
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo non trouvée');
    }

    // 2. Vérifier si la suppression est autorisée (logique métier)
    if (!TodoDomainService.canTodoBeDeleted(todo)) {
      throw new Error('Impossible de supprimer une tâche complétée depuis moins de 24h');
    }

    // 3. Supprimer
    await this.todoRepository.delete(id);
  }
}