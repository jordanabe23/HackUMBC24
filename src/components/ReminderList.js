// components/ReminderList.js
import React from 'react';
import ReminderCard from './ReminderCard';

// Sample data
const reminders = [
  {
    id: 1,
    title: 'Water Aloe Vera',
    description: 'Ensure the aloe vera plant gets enough water.',
    date: '2024-10-05',
    group: 'Plants',
    type: 'plant',
  },
  {
    id: 2,
    title: 'Vacuum Living Room',
    description: 'Vacuum the carpets and clean under the furniture.',
    date: '2024-10-07',
    group: 'Household',
    type: 'household',
  },
  {
    id: 3,
    title: 'Fertilize Tomatoes',
    description: 'Apply organic fertilizer to the tomato plants.',
    date: '2024-10-10',
    group: 'Plants',
    type: 'plant',
  },
  {
    id: 4,
    title: 'Clean Kitchen',
    description: 'Deep clean the kitchen counters and appliances.',
    date: '2024-10-12',
    group: 'Household',
    type: 'household',
  },
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
