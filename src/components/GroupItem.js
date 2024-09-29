'use client';

import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const GroupItem = ({ group }) => {
    const { groupName, todos } = group;

    return (
        <div className="group-item bg-white shadow-lg rounded-lg p-4 mb-4">
            <h2 className="text-2xl font-bold mb-2">{groupName}</h2>

            {todos && todos.length > 0 ? (
                <ul>
                    {todos.map((todo) => (
                        <li key={todo._id} className="flex items-center mb-2">
                            {todo.completed ? (
                                <FaCheckCircle className="text-green-500 mr-2" />
                            ) : (
                                <FaRegCircle className="text-gray-500 mr-2" />
                            )}
                            <div>
                                <p className={todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                                    {todo.text}
                                </p>
                                {todo.description && <p className="text-sm text-gray-600">{todo.description}</p>}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No todos available for this group.</p>
            )}
        </div>
    );
};

export default GroupItem;
