'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import '../app/Calendar.css'; // Custom styles

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample events (tasks) mapped to dates
  const events = {
  };

  const handleDateClick = (selectedDate) => {
    setSelectedDate(selectedDate);
  };

  const tileContent = ({ date, view }) => {
    const formattedDate = date.toISOString().split('T')[0];
    if (events[formattedDate]) {
      return (
        <div className="dot-indicator">
          {/* Dot indicator */}
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && date.getMonth() !== new Date().getMonth()) {
      return 'neighboring-month';
    }
    return 'current-month';
  };

  const getFormattedDate = (date) => {
    return date ? date.toISOString().split('T')[0] : '';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-dark-green mb-4">Task Calendar</h2>
      <div className="calendar-wrapper">
        <Calendar
          onChange={(date) => {
            setDate(date);
            handleDateClick(date);
          }}
          value={date}
          tileContent={tileContent}
          tileClassName={tileClassName}
          className="calendar-height"
        />
      </div>
      <div className="mt-4 p-4 bg-light-green rounded shadow to-do-container">
        <h3 className="text-lg font-semibold mb-2 text-dark-green">To-Do Items</h3>
        {selectedDate ? (
          <ul className="text-dark-green">
            {events[getFormattedDate(selectedDate)] ? (
              events[getFormattedDate(selectedDate)].map((event, index) => (
                <li key={index} className="text-sm">
                  • {event}
                </li>
              ))
            ) : (
              <li className="text-sm">No items for this day</li>
            )}
          </ul>
        ) : (
          <p className="text-sm text-dark-green">Click on a date to see the to-do items.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
