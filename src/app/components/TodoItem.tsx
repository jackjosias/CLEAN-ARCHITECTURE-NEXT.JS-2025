// src/app/components/TodoItem.tsx
'use client';

import React, { useState } from 'react';
import { TodoResponseDto, UpdateTodoDto } from '../../core/application/dto/TodoDto';
import { TodoPriority } from '../../core/domain/value-objects/TodoPriority';


interface TodoItemProps {
  todo: TodoResponseDto;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, dto: UpdateTodoDto) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedPriority, setEditedPriority] = useState<TodoPriority>(todo.priority);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    await onToggle(todo.id);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete(todo.id);
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    const dto: UpdateTodoDto = {
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
    };
    await onUpdate(todo.id, dto);
    setIsEditing(false); // Exit editing mode on successful update
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset edited state to original todo values
    setEditedTitle(todo.title);
    setEditedDescription(todo.description);
    setEditedPriority(todo.priority);
  };

  const priorityColors: Record<TodoPriority, string> = {
    [TodoPriority.LOW]: 'bg-green-500',
    [TodoPriority.MEDIUM]: 'bg-yellow-500',
    [TodoPriority.HIGH]: 'bg-orange-500',
    [TodoPriority.URGENT]: 'bg-red-500',
  };

  return (
    <li className={`p-4 mb-4 rounded-lg shadow-md ${todo.completed ? 'bg-gray-200 line-through' : 'bg-white'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {isEditing ? (
        // Edit Mode
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="p-2 border rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value as TodoPriority)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {Object.values(TodoPriority).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-200 disabled:bg-gray-400"
              disabled={isLoading}
            >
              Sauvegarder
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition duration-200 disabled:bg-gray-400"
              disabled={isLoading}
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggle}
              className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              disabled={isLoading}
            />
            <h3 className={`text-xl font-semibold ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{todo.title}</h3>
            <span className={`ml-auto text-sm px-2 py-1 rounded-full text-white ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
          </div>
          <p className={`${todo.completed ? 'text-gray-500 line-through' : 'text-gray-600'} mb-4`}>{todo.description}</p>
          
          <div className="flex space-x-2 text-sm">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
              disabled={isLoading}
            >
              Modifier
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 disabled:opacity-50"
              disabled={isLoading}
            >
              Supprimer
            </button>
          </div>
           {isLoading && <p className="text-center text-blue-600 mt-2">Chargement...</p>}
        </div>
      )}
    </li>
  );
};

export default TodoItem;
