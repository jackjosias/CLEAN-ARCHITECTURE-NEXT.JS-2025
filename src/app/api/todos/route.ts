import { NextRequest, NextResponse } from 'next/server';
import { TodoController } from '../../../infrastructure/controllers/TodoController';
import { DeleteTodoUseCase } from '../../../core/application/use-cases/DeleteTodoUseCase';
import { UpdateTodoUseCase } from '../../../core/application/use-cases/UpdateTodoUseCase';
import { ToggleTodoUseCase } from '../../../core/application/use-cases/ToggleTodoUseCase';
import { CreateTodoUseCase } from '../../../core/application/use-cases/CreateTodoUseCase';
import { GetAllTodosUseCase } from '../../../core/application/use-cases/GetAllTodosUseCase';
import { FileSystemTodoRepository } from '../../../infrastructure/adapters/FileSystemTodoRepository';

// Instancier les dépendances pour les routes API (utilisent FileSystemRepository)
const fileSystemTodoRepository = new FileSystemTodoRepository();

const createTodoUseCase = new CreateTodoUseCase(fileSystemTodoRepository);
const getAllTodosUseCase = new GetAllTodosUseCase(fileSystemTodoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(fileSystemTodoRepository);
const toggleTodoUseCase = new ToggleTodoUseCase(fileSystemTodoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(fileSystemTodoRepository);

const todoController = new TodoController(
  createTodoUseCase,
  getAllTodosUseCase,
  updateTodoUseCase,
  toggleTodoUseCase,
  deleteTodoUseCase
);

export async function GET() {
  const result = await todoController.getAllTodos();
  // Retourner uniquement le tableau de todos, pas l'objet DTO complet
  return NextResponse.json(result.data.todos, { status: result.status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await todoController.createTodo({ body });
  
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  } else {
    return NextResponse.json(result.data, { status: result.status });
  }
}

export async function PUT(
  request: NextRequest
) {
  const body = await request.json();
  // Lire l'ID depuis le corps de la requête
  const todoId = body.id;
  const result = await todoController.updateTodo({
    params: { id: todoId }, // Passer l'ID au contrôleur via params pour compatibilité
    body // Passer le reste du corps de la requête
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  } else {
    return NextResponse.json(result.data, { status: result.status });
  }
}

export async function DELETE(
  request: NextRequest
) {
  const body = await request.json();
  // Lire l'ID depuis le corps de la requête
  const todoId = body.id;
  const result = await todoController.deleteTodo({
    params: { id: todoId } // Passer l'ID au contrôleur via params pour compatibilité
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  } else {
    return NextResponse.json({}, { status: result.status });
  }
}

// Route pour toggle (PATCH)
export async function PATCH(
  request: NextRequest
) {
  const body = await request.json();
  // Lire l'ID depuis le corps de la requête
  const todoId = body.id;
   const result = await todoController.toggleTodo({
    params: { id: todoId } // Passer l'ID au contrôleur via params pour compatibilité
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  } else {
    return NextResponse.json(result.data, { status: result.status });
  }
}