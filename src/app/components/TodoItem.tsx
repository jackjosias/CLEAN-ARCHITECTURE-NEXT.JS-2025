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
    <li className={`p-4 mb-4 rounded-lg shadow-md border border-gray-300 bg-white transition-all duration-300 ease-in-out ${todo.completed ? 'opacity-70 line-through' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {isEditing ? (
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400 transition duration-150 ease-in-out bg-white"
            disabled={isLoading}
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={3}
            className="p-2 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400 transition duration-150 ease-in-out bg-white"
            disabled={isLoading}
          />
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value as TodoPriority)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150 ease-in-out bg-white"
            disabled={isLoading}
          >
            {Object.values(TodoPriority).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              className="flex-1 flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-heading font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              disabled={isLoading}
            >
              Sauvegarder
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-heading font-medium border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              disabled={isLoading}
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggle}
              className="mr-3 h-5 w-5 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 cursor-pointer transition duration-150 ease-in-out"
              disabled={isLoading}
            />
            {/* Use a span for 'Completed' text associated with the checkbox */}
            <span className={`${todo.completed ? 'text-gray-500' : 'text-gray-900'} font-body mr-3`}>Completed</span>
            <h3 className={`flex-1 text-xl font-heading font-semibold ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{todo.title}</h3> {/* Use flex-1 to allow title to take available space */}
            <span className={`ml-auto text-sm px-2 py-1 rounded-full text-white ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
          </div>
          <p className={`${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'} mb-4 font-body`}>{todo.description}</p>

          <div className="flex space-x-2 text-sm font-body">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 px-3 py-1 rounded-md hover:text-blue-800 transition duration-150 ease-in-out disabled:opacity-50 cursor-pointer"
              disabled={isLoading}
            >
              Modifier
            </button>
            {/* Delete Button - Use attention color (Tailwind default red) */}
            <button
              onClick={handleDelete}
              className="text-red-600 px-3 py-1 rounded-md hover:text-red-800 transition duration-150 ease-in-out disabled:opacity-50 cursor-pointer"
              disabled={isLoading}
            >
              Supprimer
            </button>
          </div>
           {isLoading && <p className="text-center text-blue-600 mt-2 font-body">Chargement...</p>}
        </div>
      )}
    </li>
  );
};


export default TodoItem;