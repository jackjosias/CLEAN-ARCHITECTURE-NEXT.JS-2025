// src/app/components/TodoList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import TodoItem from './TodoItem'; // Keep import for now, will remove if it's the issue
import { TodoPriority } from '../../core/domain/value-objects/TodoPriority'; // Keep for now
import { CreateTodoDto, TodoResponseDto, UpdateTodoDto } from '../../core/application/dto/TodoDto'; // Keep for now

const TodoList: React.FC = () => {
  // Minimal state to allow compilation
  const [todos, setTodos] = useState<TodoResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority>(TodoPriority.MEDIUM);
  const [isCreating, setIsCreating] = useState(false);

  // Function to fetch todos
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error(`Error fetching todos: ${response.statusText}`);
      }
      const data = await response.json();
      setTodos(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle adding a todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (!newTodoTitle.trim()) {
      setError('Le titre de la tâche ne peut pas être vide.');
      return;
    }

    setIsCreating(true);
    setError(null);

    const newTodo: CreateTodoDto = {
      title: newTodoTitle,
      description: newTodoDescription,
      priority: newTodoPriority,
    };

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error(`Error adding todo: ${response.statusText}`);
      }

      // Clear form fields and refetch todos
      setNewTodoTitle('');
      setNewTodoDescription('');
      setNewTodoPriority(TodoPriority.MEDIUM); // Reset to default priority
      fetchTodos(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding todo:", err);
    } finally {
      setIsCreating(false);
    }
  };

  // Function to handle toggling a todo status (placeholder for now)
  const handleToggleTodo = async (id: string) => {
     // This will be implemented in a later step
    console.log(`Toggle todo ${id} functionality to be implemented`);
  };

  // Function to handle deleting a todo (placeholder for now)
  const handleDeleteTodo = async (id: string) => {
     // This will be implemented in a later step
    console.log(`Delete todo ${id} functionality to be implemented`);
  };

  // Function to handle updating a todo (placeholder for now)
  const handleUpdateTodo = async (id: string, dto: UpdateTodoDto) => {
    // This will be implemented in a later step
    console.log(`Update todo ${id} functionality to be implemented with data:`, dto);
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-heading font-bold mb-6 text-center text-[var(--color-text-primary)]">Ma Liste de Tâches</h1>

      {/* Basic message for status */}
      {loading ? (
        <p className="text-center text-[var(--color-text-primary)] font-body">Chargement des tâches...</p>
      ) : error ? (
        <p className="text-center text-red-500 font-body">{error}</p>
      ) : null} {/* Remove the minimal component message */}

      {/* Formulaire de création de tâche */}
      <form onSubmit={handleAddTodo} className="mb-8 p-6 bg-[var(--color-form-background)] rounded-lg shadow-lg space-y-4 w-full md:w-1/2 mx-auto">
        <h2 className="text-2xl font-heading font-semibold text-[var(--color-text-black)]">Ajouter une tâche</h2>
        <div>
          <label htmlFor="title" className="block text-sm font-body font-medium text-[var(--color-text-black)]">Titre</label>
          <input
            type="text"
            id="title"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm sm:text-sm text-[var(--color-text-black)] transition duration-150 ease-in-out bg-[var(--color-form-background)]" /* Changed text color to black */
            required // Mark title as required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-body font-medium text-[var(--color-text-black)]">Description (Optionnel)</label>
          <textarea
            id="description"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm sm:text-sm text-[var(--color-text-black)] transition duration-150 ease-in-out bg-[var(--color-form-background)]" /* Changed text color to black */
          ></textarea>
        </div>
         <div>
          <label htmlFor="priority" className="block text-sm font-body font-medium text-[var(--color-text-black)]">Priorité</label>
          <select
            id="priority"
            value={newTodoPriority}
            onChange={(e) => setNewTodoPriority(e.target.value as TodoPriority)}
            className="mt-1 block w-full px-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm sm:text-sm text-[var(--color-text-black)] transition duration-150 ease-in-out bg-[var(--color-form-background)]" /* Changed text color to black */
          >
            {Object.values(TodoPriority).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isCreating} // Disable button while creating
          className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-heading font-medium text-[var(--color-neutral)] bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isCreating ? 'Ajout en cours...' : 'Ajouter Tâche'} {/* Update button text based on state */}
        </button>
        {/* Display creation error if any */}
        {error && <p className="text-center text-red-500 font-body">{error}</p>}
      </form>

      {/* Section d'affichage des tâches */}
      <div className="w-full md:w-1/2 max-h-[500px] overflow-y-auto mx-auto">
        {todos.length > 0 ? (
          <ul className="space-y-4">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
              />
            ))}
          </ul>
        ) : !loading && !error ? (
          <p className="text-center text-[var(--color-text-primary)] font-body">Aucune tâche trouvée. Ajoutez-en une !</p>
        ) : null}
      </div>
    </div>
  );
};

export default TodoList;
