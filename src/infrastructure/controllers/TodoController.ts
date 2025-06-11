import { CreateTodoDto, UpdateTodoDto } from "../../core/application/dto/TodoDto";
import { CreateTodoUseCase } from "../../core/application/use-cases/CreateTodoUseCase";
import { DeleteTodoUseCase } from "../../core/application/use-cases/DeleteTodoUseCase";
import { GetAllTodosUseCase } from "../../core/application/use-cases/GetAllTodosUseCase";
import { ToggleTodoUseCase } from "../../core/application/use-cases/ToggleTodoUseCase";
import { UpdateTodoUseCase } from "../../core/application/use-cases/UpdateTodoUseCase";

// src/infrastructure/controllers/TodoController.ts
export class TodoController {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly getAllTodosUseCase: GetAllTodosUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly toggleTodoUseCase: ToggleTodoUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase
  ) {}

  async createTodo(request: any): Promise<any> {
    try {
      const dto: CreateTodoDto = {
        title: request.body.title,
        description: request.body.description,
        priority: request.body.priority
      };

      const result = await this.createTodoUseCase.execute(dto);
      return { status: 201, data: result };
    } catch (error: any) {
      return { status: 400, error: error.message };
    }
  }

  async getAllTodos(): Promise<any> {
    try {
      const result = await this.getAllTodosUseCase.execute();
      return { status: 200, data: result };
    } catch (error: any) {
      return { status: 500, error: error.message };
    }
  }

  async updateTodo(request: any): Promise<any> {
    try {
      const todoId = request.params.id;
      const dto: UpdateTodoDto = {
        title: request.body.title,
        description: request.body.description,
        priority: request.body.priority
      };

      const result = await this.updateTodoUseCase.execute(todoId, dto);
      return { status: 200, data: result };
    } catch (error: any) {
      return { status: 400, error: error.message };
    }
  }

  async toggleTodo(request: any): Promise<any> {
    try {
      const todoId = request.params.id;
      const result = await this.toggleTodoUseCase.execute(todoId);
      return { status: 200, data: result };
    } catch (error: any) {
      return { status: 400, error: error.message };
    }
  }

  async deleteTodo(request: any): Promise<any> {
    try {
      const todoId = request.params.id;
      await this.deleteTodoUseCase.execute(todoId);
      return { status: 204 };
    } catch (error: any) {
      return { status: 400, error: error.message };
    }
  }
}