'use client';

import StatisticCard from './StatisticCard';
import TodoList from './TodoList';
import CalendarComponent from './CalendarComponent';

const DashboardClientWrapper = () => {
  return (
    <>
      {/* Statistics Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <StatisticCard
          end={120}
          label="Text Messages Sent"
          bgColor="bg-green-100"
          textColor="text-green-600"
        />
        <StatisticCard
          end={75}
          label="Tasks Completed"
          bgColor="bg-blue-100"
          textColor="text-blue-600"
        />
        <StatisticCard
          end={150}
          label="Tasks Created"
          bgColor="bg-pink-100"
          textColor="text-pink-600"
        />
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
