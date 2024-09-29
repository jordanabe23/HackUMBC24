"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';

const People = () => {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [plantData, setPlantData] = useState({
    name: '',
    waterFrequency: 'daily',
    soilFrequency: 'monthly',
  });
  const [groupId, setGroupId] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }
  
      const response = await fetch('/api/groups', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch groups.');
      }
  
      const data = await response.json();
      
      // Debugging log to check the structure of data
      console.log("Fetched groups data:", data);
      
      // Check if data is an array and has the required structure
      if (Array.isArray(data)) {
        // Ensure every group has `_id` and `groupName`
        const formattedGroups = data.map((group) => ({
          _id: group._id,
          name: group.name,
        }));
        
        // Set the state with the formatted groups
        setGroups(formattedGroups);
      } else {
        console.error('Data fetched is not an array:', data);
      }
      
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlantData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }

      // Define the todos for the plant
      const todos = [
        {
          name: "Pour Water",
          description: "Water the plant",
          recurrence: plantData.waterFrequency,
        },
        {
          name: "Soil Change",
          description: "Change the soil for the plant",
          recurrence: plantData.soilFrequency,
        },
      ];

      // Create a new group with name and todos
      const newGroup = {
        groupName: plantData.name, // Group name
        todos,  // The two todo items
      };

      // Send POST request to API to create the group
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error('Failed to create new group.');
      }

      const data = await response.json();
      setGroups([...groups, data]);  // Add the new group to the list
      setIsAddModalOpen(false);  // Close the modal after submission
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating new group:', error);
    }
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    console.log('Joining Group with ID:', groupId);
    setIsJoinModalOpen(false);
    setIsModalOpen(false);
  };

  const openAddPlantModal = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(true);
  };

  const openJoinPlantModal = () => {
    setIsModalOpen(false);
    setIsJoinModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(false);
    setIsJoinModalOpen(false);
  };

  return (
    <div className="relative min-h-screen p-6">
      <Head>
        <title>Manage Your Plants - Group Reminders</title>
        <meta name="description" content="Manage your plant groups easily" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
     {/* Title at the top left */}
     <h1 className="absolute top-6 left-6 text-3xl font-bold text-gray-800">Manage Your Plants</h1>

     {/* Groups Display */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        {groups.map((group) => (
          <div key={group._id} className="bg-white p-6 rounded-lg shadow-lg">
            {/* Display Group Name and ID */}
            <h2 className="text-xl text-black font-bold mb-2">
              Group Name: {group.name}
            </h2> 
            <p className="text-sm text-gray-500">
              Group ID: {group._id}
            </p>
            <div className="flex space-x-4 mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                Share
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Add New Group Button */}
        <div
          className="bg-gray-100 p-6 rounded-lg shadow-lg flex items-center justify-center cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="text-6xl text-gray-400">+</span>
        </div>
      </div>

      {/* Modal for Add/Join Options */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Choose an Option</h2>
            <div className="space-y-4">
              <button
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                onClick={openAddPlantModal}
              >
                Add New Plant
              </button>
              <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={openJoinPlantModal}
              >
                Join Existing Plant Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding a New Plant */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Plant</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Plant Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={plantData.name}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="waterFrequency" className="block text-sm font-medium text-gray-700">Water Frequency</label>
                <select
                  id="waterFrequency"
                  name="waterFrequency"
                  value={plantData.waterFrequency}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="soilFrequency" className="block text-sm font-medium text-gray-700">Soil Change Frequency</label>
                <select
                  id="soilFrequency"
                  name="soilFrequency"
                  value={plantData.soilFrequency}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Add Plant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Joining an Existing Plant Group */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Join Existing Plant Group</h2>
            <form onSubmit={handleJoinSubmit}>
              <div className="mb-4">
                <label htmlFor="groupId" className="block text-sm font-medium text-gray-700">Group ID</label>
                <input
                  type="text"
                  id="groupId"
                  name="groupId"
                  value={groupId}
                  onChange={handleGroupIdChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Join Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default People;
