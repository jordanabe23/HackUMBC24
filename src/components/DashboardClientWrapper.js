'use client';

import { useEffect, useState } from 'react';
import StatisticCard from './StatisticCard';
import TodoList from './TodoList';
import CalendarComponent from './CalendarComponent';

const DashboardClientWrapper = () => {
  // Simulating fetching user's name (this could be replaced with actual logic like fetching from an API or getting it from context)
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Simulate fetching the username from an API or auth context
    const fetchUser = async () => {
      const fetchedUser = 'Welcome To Your Dashboard'; // Replace with actual fetch logic
      setUsername(fetchedUser);
    };

    fetchUser();
  }, []);

  return (
    <>
      {/* Header Section */}
      <div className="mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Username Section */}
        <h2 className="text-black text-6xl font-bold">
          {username ? username : 'User'}!
        </h2>

        {/* Statistics Section */}
        <div className="flex gap-4 justify-end w-full lg:w-auto">
          <StatisticCard
            end={120}
            label="Text Messages Sent"
            bgColor="bg-[#EAD2AC]"
            textColor="text-[#F5F5DC]"
          />
          <StatisticCard
            end={75}
            label="Tasks Completed"
            bgColor="bg-[#4CC9F0]"
            textColor="text-blue-600"
          />
          <StatisticCard
            end={150}
            label="Tasks Created"
            bgColor= "bg-[#3A967F]"
            textColor="text-[#9AB973]"
          />
        </div>
      </div>

      {/* Main Content: Todo List and Calendar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          <TodoList />
        </div>
        <div className="lg:w-1/2">
          <CalendarComponent />
        </div>
      </div>
    </>
  );
};

export default DashboardClientWrapper;