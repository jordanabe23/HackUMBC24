'use client';

import { useState, useEffect } from 'react';

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

    // Function to toggle completion status
    const toggleCompleted = async (todoId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/todos/${todoId}`, {
                method: 'PUT', // Use PUT for updating an existing todo
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    completed: true // Mark as completed
                })
            });

            if (!response.ok) throw new Error('Failed to update todo');

            // Update the todo list after completion
            setTodos(todos.map(todo => {
                if (todo._id === todoId) {
                    return { ...todo, completed: true }; // Set completed to true
                }
                return todo;
            }));
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
                            <button
                                onClick={() => toggleCompleted(todo._id)} // Toggle and make the button white
                                className={`cursor-pointer bg-${todo.completed ? 'white' : 'blue-500'} text-${todo.completed ? 'white' : 'white'} p-2 rounded`}
                            >
                                Mark as Done
                            </button>
                            <div className="ml-2">
                                {/* Always set the text color to black */}
                                <p className="text-black">
                                    {todo.name}
                                </p>
                                {todo.description && (
                                    <p className="text-black">{todo.description}</p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-black"> No todos available for this group.</p>
            )}

            {/* Input fields and button for adding new todo */}
            <div className="mt-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)} // Update state on name input change
                    placeholder="Todo name"
                    className="border border-gray-300 p-2 rounded w-full mb-2 text-black"
                />
                <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)} // Update state on description input change
                    placeholder="Todo description"
                    className="border border-gray-300 p-2 rounded w-full mb-2 text-black" // Ensuring text is black
                />
                <input
                    type="text"
                    value={newRecurrence}
                    onChange={(e) => setNewRecurrence(e.target.value)} // Update state on recurrence input change
                    placeholder="Recurrence (e.g., Daily, Weekly)"
                    className="border border-gray-300 p-2 rounded w-full mb-2 text-black" // Ensuring text is black
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
