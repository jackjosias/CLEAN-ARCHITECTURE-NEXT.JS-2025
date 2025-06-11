import { TodoRepository } from "../../core/application/ports/TodoRepository";
import { Todo } from "../../core/domain/entities/Todo";
import { TodoPriority } from "../../core/domain/value-objects/TodoPriority";


// src/infrastructure/adapters/FakeTodoRepository.ts
export class FakeTodoRepository implements TodoRepository {
  private todos: Map<string, Todo> = new Map();

  constructor() {
    // Données fake pour le développement
    this.initializeFakeData();
  }

  private initializeFakeData(): void {
    const fakeTodos = [
      Todo.create('Apprendre Next.js 15', 'Maîtriser les nouvelles fonctionnalités', TodoPriority.HIGH),
      Todo.create('Faire les courses', 'Acheter fruits et légumes', TodoPriority.MEDIUM),
      Todo.create('Réviser TypeScript', 'Revoir les concepts avancés', TodoPriority.LOW),
      Todo.create('Meeting équipe', 'Réunion hebdomadaire à 14h', TodoPriority.URGENT)
    ];

    // Marquer quelques tâches comme complétées
    const completedTodo = fakeTodos[1].markAsCompleted();
    
    fakeTodos.forEach(todo => this.todos.set(todo.id, todo));
    this.todos.set(completedTodo.id, completedTodo);
  }

  async save(todo: Todo): Promise<void> {
    this.todos.set(todo.id, todo);
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.get(id) || null;
  }

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async delete(id: string): Promise<void> {
    this.todos.delete(id);
  }

  async update(id: string, todo: Todo): Promise<void> {
    this.todos.set(id, todo);
  }
}