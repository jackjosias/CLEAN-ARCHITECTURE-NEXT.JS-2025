import { TodoPriority } from "../../domain/value-objects/TodoPriority";

// src/core/application/dto/TodoDto.ts
export interface CreateTodoDto {
  title: string;
  description: string;
  priority?: TodoPriority;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  priority?: TodoPriority;
}

export interface TodoResponseDto {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: string;
  updatedAt: string;
}

export interface TodoListResponseDto {
  todos: TodoResponseDto[];
  total: number;
  completed: number;
  pending: number;
}