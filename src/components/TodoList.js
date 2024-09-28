'use client';

import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { useState } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Water Aloe Vera', completed: false },
    { id: 2, text: 'Vacuum Living Room', completed: true },
    { id: 3, text: 'Fertilize Tomatoes', completed: false },
    { id: 4, text: 'Clean Kitchen', completed: false },
  ]);

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="bg-pink-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Tasks</h2>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center mb-3 cursor-pointer"
            onClick={() => toggleComplete(todo.id)}
          >
            {todo.completed ? (
              <FaCheckCircle className="text-green-500 mr-3" />
            ) : (
              <FaRegCircle className="text-gray-500 mr-3" />
            )}
            <span
              className={`text-gray-700 ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
