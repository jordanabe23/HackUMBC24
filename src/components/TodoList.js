import { useEffect, useState } from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import axios from 'axios';

const TodoList = ({ userId }) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`/api/todos/user/${userId}`);
        setTodos(response.data);
      } catch (err) {
        console.error('Error fetching to-dos:', err);
      }
    };

    fetchTodos();
  }, [userId]);

  const toggleComplete = async (id) => {
    const todo = todos.find((todo) => todo._id === id);
    try {
      await axios.put(`/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err) {
      console.error('Error updating to-do:', err);
    }
  };

  return (
    <div className="bg-pink-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Tasks</h2>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center mb-3 cursor-pointer"
            onClick={() => toggleComplete(todo._id)}
          >
            {todo.completed ? (
              <FaCheckCircle className="text-green-500 mr-3" />
            ) : (
              <FaRegCircle className="text-gray-500 mr-3" />
            )}
            <div>
              <span className={`text-gray-700 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
              {todo.plant && (
                <p className="text-sm text-gray-600">
                  Plant: {todo.plant.name}, Water every {todo.plant.wateringFrequency} days
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
