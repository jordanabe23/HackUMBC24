// src/components/Sidebar.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaComments, FaCalendarAlt, FaUsers, FaCog, FaBars } from 'react-icons/fa';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { name: 'Chat', icon: <FaComments /> },
    { name: 'Calendar', icon: <FaCalendarAlt /> },
    { name: 'People', icon: <FaUsers /> },
    { name: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div
      className={`${
        isExpanded ? 'w-64' : 'w-20'
      } bg-blue-200 h-screen p-5 pt-8 relative duration-300`}
    >
      <FaBars
        className={`absolute cursor-pointer -right-3 top-9 w-7 border-blue-300
        border-2 rounded-full ${!isExpanded && 'rotate-180'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      />
      <div className="flex items-center gap-x-4">
        <FaComments className="text-2xl text-gray-800" />
        {isExpanded && (
          <span className="text-gray-800 text-xl font-bold">Reminders</span>
        )}
      </div>
      <ul className="pt-6">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-x-4 cursor-pointer p-2 hover:bg-blue-300 rounded-md mt-2"
          >
            <span className="text-2xl text-gray-800">{item.icon}</span>
            {isExpanded && (
              <Link href={`/${item.name.toLowerCase()}`}>
                <span className="text-gray-800 text-lg">{item.name}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
