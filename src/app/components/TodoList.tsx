// src/app/components/TodoList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import TodoItem from './TodoItem';
import { TodoPriority } from '../../core/domain/value-objects/TodoPriority';
import { CreateTodoDto, TodoResponseDto, UpdateTodoDto } from '../../core/application/dto/TodoDto';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority>(TodoPriority.MEDIUM);
  const [isCreating, setIsCreating] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: TodoResponseDto[] = await response.json();
      setTodos(data);
    } catch (e: any) {
      console.error('Erreur fetching todos:', e);
      setError('Erreur lors du chargement des tâches.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim().length < 2) return; // Basic validation

    setIsCreating(true);
    try {
      const newTodo: CreateTodoDto = {
        title: newTodoTitle,
        description: newTodoDescription,
        priority: newTodoPriority,
      };
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear form and refetch todos
      setNewTodoTitle('');
      setNewTodoDescription('');
      setNewTodoPriority(TodoPriority.MEDIUM);
      await fetchTodos(); // Refetch list to show the new todo

    } catch (e: any) {
      console.error('Erreur creating todo:', e);
      setError('Erreur lors de la création de la tâche.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }), // Pass ID in body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state or refetch
      // For simplicity and consistency after any action, we refetch
      await fetchTodos();

    } catch (e: any) {
      console.error('Erreur toggling todo:', e);
      setError('Erreur lors du changement d\'état de la tâche.');
    }
  };

  const handleDeleteTodo = async (id: string) => {
     try {
      const response = await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }), // Pass ID in body
      });

      if (!response.ok) {
         // Check for 204 No Content, which is success for delete
         if (response.status !== 204) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
      }

      // Update local state or refetch
      await fetchTodos(); // Refetch list

    } catch (e: any) {
      console.error('Erreur deleting todo:', e);
      setError('Erreur lors de la suppression de la tâche.');
    }
  };

   const handleUpdateTodo = async (id: string, dto: UpdateTodoDto) => {
     try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...dto }), // Pass ID in body along with updates
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state or refetch
      await fetchTodos(); // Refetch list

    } catch (e: any) {
      console.error('Erreur updating todo:', e);
      setError('Erreur lors de la mise à jour de la tâche.');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []); // Fetch todos on initial mount

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Ma Liste de Tâches</h1>

      {/* Formulaire d'ajout de tâche */}
      <form onSubmit={handleCreateTodo} className="mb-8 p-6 bg-white rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Nouvelle Tâche</h2>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            id="title"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={isCreating}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isCreating}
          ></textarea>
        </div>
         <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priorité</label>
          <select
            id="priority"
            value={newTodoPriority}
            onChange={(e) => setNewTodoPriority(e.target.value as TodoPriority)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
             disabled={isCreating}
          >
            {Object.values(TodoPriority).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isCreating || newTodoTitle.trim().length < 2}
        >
          {isCreating ? 'Ajout en cours...' : 'Ajouter Tâche'}
        </button>
      </form>

      {/* Liste des tâches */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Chargement des tâches...</p>
      ) : todos.length === 0 ? (
        <p className="text-center text-gray-500">Aucune tâche pour le moment.</p>
      ) : (
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
      )}
    </div>
  );
};

export default TodoList;
