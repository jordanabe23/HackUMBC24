'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaCalendarAlt, FaUsers, FaCog, FaSignOutAlt, FaPagelines, FaComment } from 'react-icons/fa';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true); // Initially expanded
  const [hasCollapsedOnce, setHasCollapsedOnce] = useState(false); // Track if it has collapsed once
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/' },
    { name: 'Chat', icon: <FaComment />, path: '/chat' },
    { name: 'People', icon: <FaUsers />, path: '/people' }
  ];

  function handleLogout() {
    // Clear the JWT token from local storage
    localStorage.removeItem('token');
    // Redirect to the login page or home page
    router.push('/login');
  }

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
    </div>
  );
};

export default Sidebar;
