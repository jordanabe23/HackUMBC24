// components/ReminderList.js
import React from 'react';
import ReminderCard from './ReminderCard';

// Sample data
const reminders = [
];

const ReminderList = () => {
  return (
    <div className="grid gap-6">
      {reminders.map((reminder) => (
        <ReminderCard key={reminder.id} reminder={reminder} />
      ))}
    </div>
  );
};

export default ReminderList;
