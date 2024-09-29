'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import '../app/Calendar.css'; // Custom styles

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [error, setError] = useState(null);

  // Animation state
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      if (!token) {
        setError('User is not authenticated.');
        return;
      }

      try {
        const response = await fetch('/api/todos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in again.');
          } else {
            throw new Error('Failed to fetch todos.');
          }
        }

        const todos = await response.json();

        const updatedEvents = {};
        todos.forEach(todo => {
          // Handle recurrence logic as before (daily, weekly, etc.)
          if (todo.recurrence === 'daily') {
            for (let i = 0; i < 365; i++) {
              const day = new Date();
              day.setDate(day.getDate() + i);
              const formattedDate = day.toISOString().split('T')[0];

              if (!updatedEvents[formattedDate]) {
                updatedEvents[formattedDate] = [];
              }
              updatedEvents[formattedDate].push(todo.text);
            }
          } else if (todo.recurrence === 'weekly') {
            for (let i = 0; i < 52; i++) {
              const week = new Date();
              week.setDate(week.getDate() + i * 7);
              const formattedDate = week.toISOString().split('T')[0];

              if (!updatedEvents[formattedDate]) {
                updatedEvents[formattedDate] = [];
              }
              updatedEvents[formattedDate].push(todo.text);
            }
          } else if (todo.recurrence === 'monthly') {
            for (let i = 0; i < 12; i++) {
              const month = new Date();
              month.setMonth(month.getMonth() + i);
              const formattedDate = month.toISOString().split('T')[0];

              if (!updatedEvents[formattedDate]) {
                updatedEvents[formattedDate] = [];
              }
              updatedEvents[formattedDate].push(todo.text);
            }
          } else if (todo.recurrence === 'yearly') {
            const year = new Date();
            const formattedDate = year.toISOString().split('T')[0];

            if (!updatedEvents[formattedDate]) {
              updatedEvents[formattedDate] = [];
            }
            updatedEvents[formattedDate].push(todo.text);
          }
        });

        setEvents(updatedEvents); // Set the events in state
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchTodos();
  }, []);

  // Function to calculate the date based on the index
  const calculateDate = (index) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + index);
    return futureDate;
  };

  // Start the day-cycling animation
  useEffect(() => {
    const totalDays = 14; // Cycle through the next two weeks

    const cycleDays = setInterval(() => {
      const nextIndex = (currentDayIndex + 1) % totalDays; // Loop back after 14 days
      const newDate = calculateDate(nextIndex); // Calculate the new date
      setCurrentDayIndex(nextIndex); // Update the index
      setSelectedDate(newDate); // Set the new date as selected

      // Optionally scroll the calendar to the selected date (if applicable)
      setDate(newDate);
    }, 1500); // Change day every second (adjust as necessary)

    return () => clearInterval(cycleDays); // Cleanup the interval on component unmount
  }, [currentDayIndex]);

  const handleDateClick = (selectedDate) => {
    setSelectedDate(selectedDate);
  };

  const tileContent = ({ date }) => {
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
    <div className="bg-white p-6 rounded-lg shadow-md bg-gradient-to-br from-green-100 to-green-300">
      <h2 className="text-2xl font-semibold text-dark-green mb-4">Task Calendar</h2>
      <div className="calendar-wrapper">
        {error && <p className="text-red-500">{error}</p>} {/* Display error if exists */}
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
