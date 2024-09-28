import { useEffect, useState } from 'react';
import { FaCheckCircle, FaRegCircle, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const TodoList = ({ userId }) => {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    text: '',
    description: '',
    recurrence: 'once',
    date: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/todos', { ...newTodo, userId });
      setTodos((prev) => [...prev, response.data]);
      setIsModalOpen(false);
      setNewTodo({ text: '', description: '', recurrence: 'once', date: '' });
    } catch (err) {
      console.error('Error adding new to-do:', err);
    }
  };

  return (
    <div className="bg-pink-100 p-6 rounded-lg shadow-md relative">
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
              {todo.description && (
                <p className="text-sm text-gray-600">{todo.description}</p>
              )}
              {todo.recurrence !== 'once' && (
                <p className="text-sm text-gray-600">Recurs: {todo.recurrence}</p>
              )}
              {todo.date && (
                <p className="text-sm text-gray-600">Date: {new Date(todo.date).toLocaleDateString()}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <FaPlus />
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="text"
                value={newTodo.text}
                onChange={handleInputChange}
                placeholder="Task name"
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={newTodo.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full p-2 mb-2 border rounded"
              />
              <select
                name="recurrence"
                value={newTodo.recurrence}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <input
                type="date"
                name="date"
                value={newTodo.date}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;