'use client';

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const GroupItem = ({ group }) => {
    const { name, _id } = group; // Destructure group name and group ID
    const [newTodo, setNewTodo] = useState(''); // State to hold new todo name input
    const [newDescription, setNewDescription] = useState(''); // State to hold new todo description input
    const [newRecurrence, setNewRecurrence] = useState(''); // State to hold new todo recurrence input
    const [todos, setTodos] = useState([]); // State to hold fetched todos
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch all todos and filter by group ID
    const fetchTodos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/todos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }

            const data = await response.json();
            console.log('Fetched todos:', data);
            // Filter todos where todo.groupId matches group._id
            const filteredTodos = data.filter(todo => todo.groupId === _id);

            setTodos(filteredTodos); // Set the filtered todos in state
            setLoading(false); // Set loading to false when done
        } catch (err) {
            console.error('Error fetching todos:', err.message);
            setLoading(false); // Set loading to false in case of error
        }
    };

    // Use useEffect to fetch todos when the component mounts
    useEffect(() => {
        fetchTodos();
    }, [_id]); // Dependency array: run fetchTodos whenever group ID changes

    // Function to handle adding a new todo to the group
    // Function to handle adding a new todo to the group
    const handleAddTodo = async () => {
        if (!newTodo.trim() || !newDescription.trim() || !newRecurrence.trim()) {
            alert("Please enter a todo name, description, and recurrence.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/todos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newTodo.trim(),
                    description: newDescription.trim(),
                    recurrence: newRecurrence.trim(),
                    groupId: _id, // Associate the todo with the group ID
                    completed: false, // New todos are incomplete by default
                })
            });

            if (!response.ok) throw new Error('Failed to add todo');

            const newTodoData = await response.json();

            // Assuming the backend adds the todo to the group's todo list,
            // we directly push the new todo into the group's todos array
            setTodos([...todos, newTodoData]); // Update the todos list

            setNewTodo(''); // Clear the name input after adding
            setNewDescription(''); // Clear the description input after adding
            setNewRecurrence(''); // Clear the recurrence input after adding
        } catch (err) {
            console.error('Error adding todo:', err.message);
        }
    };


    const toggleCompleted = async (todoId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/todos/${todoId}`, {
                method: 'PUT', // Use PUT for updating an existing todo
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    completed: !currentStatus // Toggle the current completed status
                })
            });

            if (!response.ok) throw new Error('Failed to update todo');

            const updatedTodo = await response.json();

            // Update the todo list with the new completed status
            setTodos(todos.map(todo => (todo._id === updatedTodo._id ? updatedTodo : todo)));
        } catch (err) {
            console.error('Error updating todo:', err.message);
        }
    };


    return (
        <div className="group-item bg-white shadow-lg rounded-lg p-4 mb-4">
            {/* Display the group name as the card title */}
            <h1 className="text-3xl font-bold mb-4 text-white bg-blue-500 p-2 rounded">{name}</h1>
            {/* Show loading indicator while fetching */}
            {loading ? (
                <p>Loading todos...</p>
            ) : todos.length > 0 ? (
                <ul>
                    {todos.map((todo) => (
                        <li key={todo._id} className="flex items-center mb-2">
                            <span
                                onClick={() => toggleCompleted(todo._id, todo.completed)} // Toggle the completed status on click
                                className="cursor-pointer"
                            >
                                {todo.completed ? (
                                    <FaCheckCircle className="text-green-500 mr-2" />
                                ) : (
                                    <FaRegCircle className="text-gray-500 mr-2" />
                                )}
                            </span>
                            <div>
                                <p className={todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                                    {todo.name}
                                </p>
                                {todo.description && (
                                    <p className="text-sm text-gray-600">{todo.description}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No todos available for this group.</p>
            )}

            {/* Input fields and button for adding new todo */}
            <div className="mt-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)} // Update state on name input change
                    placeholder="Todo name"
                    className="border border-gray-300 p-2 rounded w-full mb-2"
                />
                <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)} // Update state on description input change
                    placeholder="Todo description"
                    className="border border-gray-300 p-2 rounded w-full mb-2"
                />
                <input
                    type="text"
                    value={newRecurrence}
                    onChange={(e) => setNewRecurrence(e.target.value)} // Update state on recurrence input change
                    placeholder="Recurrence (e.g., Daily, Weekly)"
                    className="border border-gray-300 p-2 rounded w-full mb-2"
                />
                <button
                    onClick={handleAddTodo}
                    className="mt-2 bg-blue-500 text-white p-2 rounded w-full"
                >
                    Add Todo
                </button>
            </div>
        </div>
    );
};

export default GroupItem;
