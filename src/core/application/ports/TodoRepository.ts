import { Todo } from "../../domain/entities/Todo";

// src/core/application/ports/TodoRepository.ts
export interface TodoRepository {
  save(todo: Todo): Promise<void>;
  findById(id: string): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  delete(id: string): Promise<void>;
  update(id: string, todo: Todo): Promise<void>;
}