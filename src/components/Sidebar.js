'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaCalendarAlt, FaUsers, FaCog, FaSignOutAlt, FaPagelines, FaComment, FaPlusCircle } from 'react-icons/fa';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true); // Initially expanded
  const [hasCollapsedOnce, setHasCollapsedOnce] = useState(false); // Track if it has collapsed once
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [groupName, setGroupName] = useState(''); // Group name state
  const [error, setError] = useState(null); // Error state for form
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/' },
    { name: 'Chat', icon: <FaComment />, path: '/chat' },
    { name: 'Calendar', icon: <FaCalendarAlt />, path: '/calendar' },
    { name: 'Plants', icon: <FaUsers />, path: '/people' },
    { name: 'Settings', icon: <FaCog />, path: '/settings' }
  ];

  function handleLogout() {
    // Clear the JWT token from local storage
    localStorage.removeItem('token');
    // Redirect to the login page or home page
    router.push('/login');
  }

  // Create new group API call
  const createGroup = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token not found.');
      }

      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupName })
      });

      if (!response.ok) {
        throw new Error(`Failed to create group: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Group created:', data);

      // Reset form and close modal
      setGroupName('');
      setIsModalOpen(false);
      setError(null);

      // You can also redirect or refresh the group list here if needed
    } catch (err) {
      setError(err.message || 'Failed to create group. Please try again later.');
    }
  };

  // Auto-collapse the sidebar once after the component is first rendered
  useEffect(() => {
    if (!hasCollapsedOnce) {
      setTimeout(() => {
        setIsExpanded(false); // Collapse the sidebar
        setHasCollapsedOnce(true); // Ensure it only happens once
      }, 4000); // Optional delay of 1 second for visibility
    }
  }, [hasCollapsedOnce]);

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-20'} bg-blue-200 p-5 pt-8 relative duration-1000 flex flex-col justify-between h-screen`}>
      <div>
        <FaPagelines
          className={`absolute cursor-pointer -right-3 top-9 w-10 h-10 p-1 border-2 rounded-full
            border-green-600 bg-green-200 text-green-900
            transition-transform duration-500 ease-in-out
            hover:rotate-180 hover:scale-150 hover:bg-green-400 hover:border-green-800 hover:text-white
            shadow-xl hover:shadow-green-600/70
          `}
          title={isExpanded ? "Collapse" : "Expand"}  // Tooltip for clarity
          onClick={() => setIsExpanded(!isExpanded)}
        />
        <div className="flex items-center gap-x-4">
          {isExpanded && <span className="text-gray-800 text-xl font-bold text-center">Reminders</span>}
        </div>
        <ul className="pt-6">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <li key={index} className="flex items-center">
                <Link href={item.path} passHref>
                  <div
                    className={`flex items-center gap-x-4 cursor-pointer p-2 rounded-md mt-2 ${isActive ? 'bg-blue-300' : 'hover:bg-blue-300'}`}
                  >
                    <span className="text-2xl text-gray-800">{item.icon}</span>
                    {isExpanded && <span className="text-gray-800 text-lg">{item.name}</span>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Create Group Button */}
        <div className="flex items-center mt-6 cursor-pointer p-2 rounded-md hover:bg-blue-300" onClick={() => setIsModalOpen(true)}>
          <FaPlusCircle className="text-2xl text-gray-800" />
          {isExpanded && <span className="text-gray-800 text-lg ml-2">Create New Group</span>}
        </div>
      </div>

      {/* Logout Button Positioned at the Bottom */}
      <div className="pb-4">
        <div
          onClick={handleLogout}
          className="flex items-center gap-x-4 cursor-pointer p-2 rounded-md hover:bg-blue-300"
        >
          <span className="text-2xl text-gray-800"><FaSignOutAlt /></span>
          {isExpanded && <span className="text-gray-800 text-lg">Logout</span>}
        </div>
      </div>

      {/* Modal for Creating New Group */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Create New Group</h2>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="border border-gray-300 p-2 w-full mb-4"
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
