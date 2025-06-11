import { TodoRepository } from "../../core/application/ports/TodoRepository";
import { CreateTodoUseCase } from "../../core/application/use-cases/CreateTodoUseCase";
import { GetAllTodosUseCase } from "../../core/application/use-cases/GetAllTodosUseCase";
import { UpdateTodoUseCase } from "../../core/application/use-cases/UpdateTodoUseCase";
import { ToggleTodoUseCase } from "../../core/application/use-cases/ToggleTodoUseCase";
import { DeleteTodoUseCase } from "../../core/application/use-cases/DeleteTodoUseCase";
import { TodoController } from "../controllers/TodoController";
import { FakeTodoRepository } from "../adapters/FakeTodoRepository";
import { ApiTodoRepository } from "../adapters/ApiTodoRepository";

// src/infrastructure/config/DependencyContainer.ts
export class DependencyContainer {
  protected todoRepository: TodoRepository;
  protected createTodoUseCase: CreateTodoUseCase;
  protected getAllTodosUseCase: GetAllTodosUseCase;
  protected updateTodoUseCase: UpdateTodoUseCase;
  protected toggleTodoUseCase: ToggleTodoUseCase;
  protected deleteTodoUseCase: DeleteTodoUseCase;
  protected todoController: TodoController;

  constructor() {
    // Choisir l'adapter selon la variable d'environnement
    const useApi = process.env.NEXT_PUBLIC_USE_API === 'true';
    
    if (useApi) {
      console.log('🌐 Utilisation de l\'API Repository');
      this.todoRepository = new ApiTodoRepository();
    } else {
      console.log('🎭 Utilisation du Fake Repository');
      this.todoRepository = new FakeTodoRepository();
    }

    // Créer les use cases
    this.createTodoUseCase = new CreateTodoUseCase(this.todoRepository);
    this.getAllTodosUseCase = new GetAllTodosUseCase(this.todoRepository);
    this.updateTodoUseCase = new UpdateTodoUseCase(this.todoRepository);
    this.toggleTodoUseCase = new ToggleTodoUseCase(this.todoRepository);
    this.deleteTodoUseCase = new DeleteTodoUseCase(this.todoRepository);

    // Créer le controller
    this.todoController = new TodoController(
      this.createTodoUseCase,
      this.getAllTodosUseCase,
      this.updateTodoUseCase,
      this.toggleTodoUseCase,
      this.deleteTodoUseCase
    );
  }

  getCreateTodoUseCase(): CreateTodoUseCase {
    return this.createTodoUseCase;
  }

  getGetAllTodosUseCase(): GetAllTodosUseCase {
    return this.getAllTodosUseCase;
  }

  getUpdateTodoUseCase(): UpdateTodoUseCase {
    return this.updateTodoUseCase;
  }

  getToggleTodoUseCase(): ToggleTodoUseCase {
    return this.toggleTodoUseCase;
  }

  getDeleteTodoUseCase(): DeleteTodoUseCase {
    return this.deleteTodoUseCase;
  }

  getTodoController(): TodoController {
    return this.todoController;
  }
}