import { Todo } from "../entities/Todo";
import { TodoPriority } from "../value-objects/TodoPriority";

// src/core/domain/services/TodoDomainService.ts
export class TodoDomainService {
  static canTodoBeDeleted(todo: Todo): boolean {
    // Logique métier : on peut supprimer une tâche seulement si elle est complétée depuis plus de 1 jour
    if (!todo.completed) {
      return true; // Peut supprimer une tâche non complétée
    }
    
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const timeSinceCompletion = new Date().getTime() - todo.updatedAt.getTime();
    
    return timeSinceCompletion > oneDayInMs;
  }

  static isPriorityUrgent(todo: Todo): boolean {
    return todo.priority === TodoPriority.URGENT;
  }

  static shouldShowWarning(todo: Todo): boolean {
    // Afficher un warning si la tâche est urgente et pas complétée depuis plus de 2 jours
    if (todo.completed || todo.priority !== TodoPriority.URGENT) {
      return false;
    }
    
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    const timeSinceCreation = new Date().getTime() - todo.createdAt.getTime();
    
    return timeSinceCreation > twoDaysInMs;
  }
}