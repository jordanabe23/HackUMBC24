'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import '../app/Calendar.css'; // Custom styles

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  // Sample events (tasks) mapped to dates
  const events = {
    '2024-10-05': ['Water Aloe Vera'],
    '2024-10-07': ['Vacuum Living Room'],
    '2024-10-10': ['Fertilize Tomatoes'],
    '2024-10-12': ['Clean Kitchen'],
  };

  const tileContent = ({ date, view }) => {
    const formattedDate = date.toISOString().split('T')[0];
    if (events[formattedDate]) {
      return (
        <ul className="mt-1">
          {events[formattedDate].map((event, index) => (
            <li key={index} className="text-xs text-blue-600">
              • {event}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div className="bg-blue-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Task Calendar</h2>
      <Calendar onChange={setDate} value={date} tileContent={tileContent} />
    </div>
  );
};

export default CalendarComponent;
