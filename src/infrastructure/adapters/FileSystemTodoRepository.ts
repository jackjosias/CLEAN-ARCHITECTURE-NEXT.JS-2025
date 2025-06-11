import { promises as fs } from 'fs';
import path from 'path';
import { TodoRepository } from '../../core/application/ports/TodoRepository';
import { Todo } from '../../core/domain/entities/Todo';

// src/infrastructure/adapters/FileSystemTodoRepository.ts
export class FileSystemTodoRepository implements TodoRepository {
  private readonly dataFile = path.join(process.cwd(), 'data.json');

  private async readTodos(): Promise<any[]> {
    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async writeTodos(todos: any[]): Promise<void> {
    await fs.writeFile(this.dataFile, JSON.stringify(todos, null, 2));
  }

  async save(todo: Todo): Promise<void> {
    const todos = await this.readTodos();
    const todoData = {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      priority: todo.priority,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString()
    };
    
    todos.push(todoData);
    await this.writeTodos(todos);
  }

  async findById(id: string): Promise<Todo | null> {
    const todos = await this.readTodos();
    const todoData = todos.find(t => t.id === id);
    
    if (!todoData) return null;
    
    return Todo.fromPersistence(
      todoData.id,
      todoData.title,
      todoData.description,
      todoData.completed,
      todoData.priority,
      new Date(todoData.createdAt),
      new Date(todoData.updatedAt)
    );
  }

  async findAll(): Promise<Todo[]> {
    const todos = await this.readTodos();
    return todos.map(todoData => 
      Todo.fromPersistence(
        todoData.id,
        todoData.title,
        todoData.description,
        todoData.completed,
        todoData.priority,
        new Date(todoData.createdAt),
        new Date(todoData.updatedAt)
      )
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async delete(id: string): Promise<void> {
    const todos = await this.readTodos();
    const filteredTodos = todos.filter(t => t.id !== id);
    await this.writeTodos(filteredTodos);
  }

  async update(id: string, todo: Todo): Promise<void> {
    const todos = await this.readTodos();
    const index = todos.findIndex(t => t.id === id);
    
    if (index !== -1) {
      todos[index] = {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        priority: todo.priority,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString()
      };
      await this.writeTodos(todos);
    }
  }
}