import { TodoRepository } from "../../core/application/ports/TodoRepository";
import { Todo } from "../../core/domain/entities/Todo";


// src/infrastructure/adapters/ApiTodoRepository.ts
export class ApiTodoRepository implements TodoRepository {
  private readonly baseUrl = '/api/todos';

  async save(todo: Todo): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        priority: todo.priority,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde');
    }
  }

  async findById(id: string): Promise<Todo | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération');
    }

    const data = await response.json();
    return Todo.fromPersistence(
      data.id,
      data.title,
      data.description,
      data.completed,
      data.priority,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }

  async findAll(): Promise<Todo[]> {
    const response = await fetch(this.baseUrl);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des todos');
    }

    const data = await response.json();
    return data.map((item: any) => 
      Todo.fromPersistence(
        item.id,
        item.title,
        item.description,
        item.completed,
        item.priority,
        new Date(item.createdAt),
        new Date(item.updatedAt)
      )
    );
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }
  }

  async update(id: string, todo: Todo): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        priority: todo.priority,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour');
    }
  }
}