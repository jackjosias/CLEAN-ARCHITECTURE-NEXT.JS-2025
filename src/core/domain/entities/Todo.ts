import { TodoPriority } from "../value-objects/TodoPriority";

// src/core/domain/entities/Todo.ts
export class Todo {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _description: string,
    private readonly _completed: boolean,
    private readonly _priority: TodoPriority,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {}

  static create(title: string, description: string, priority: TodoPriority = TodoPriority.MEDIUM): Todo {
    if (title.trim().length < 2) {
      throw new Error('Le titre doit contenir au moins 2 caractères');
    }
    
    const now = new Date();
    return new Todo(
      crypto.randomUUID(),
      title.trim(),
      description.trim(),
      false,
      priority,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    title: string,
    description: string,
    completed: boolean,
    priority: TodoPriority,
    createdAt: Date,
    updatedAt: Date
  ): Todo {
    return new Todo(id, title, description, completed, priority, createdAt, updatedAt);
  }

  // Getters
  get id(): string { return this._id; }
  get title(): string { return this._title; }
  get description(): string { return this._description; }
  get completed(): boolean { return this._completed; }
  get priority(): TodoPriority { return this._priority; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Logique métier
  markAsCompleted(): Todo {
    if (this._completed) {
      throw new Error('Cette tâche est déjà complétée');
    }
    return new Todo(
      this._id,
      this._title,
      this._description,
      true,
      this._priority,
      this._createdAt,
      new Date()
    );
  }

  markAsIncomplete(): Todo {
    if (!this._completed) {
      throw new Error('Cette tâche n est pas complétée');
    }
    return new Todo(
      this._id,
      this._title,
      this._description,
      false,
      this._priority,
      this._createdAt,
      new Date()
    );
  }

  updateTitle(newTitle: string): Todo {
    if (newTitle.trim().length < 2) {
      throw new Error('Le titre doit contenir au moins 2 caractères');
    }
    return new Todo(
      this._id,
      newTitle.trim(),
      this._description,
      this._completed,
      this._priority,
      this._createdAt,
      new Date()
    );
  }

  updateDescription(newDescription: string): Todo {
    return new Todo(
      this._id,
      this._title,
      newDescription.trim(),
      this._completed,
      this._priority,
      this._createdAt,
      new Date()
    );
  }

  updatePriority(newPriority: TodoPriority): Todo {
    return new Todo(
      this._id,
      this._title,
      this._description,
      this._completed,
      newPriority,
      this._createdAt,
      new Date()
    );
  }
}