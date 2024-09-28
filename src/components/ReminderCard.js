// components/ReminderCard.js
import React from 'react';
import { FaLeaf, FaHouseUser } from 'react-icons/fa';

const ReminderCard = ({ reminder }) => {
  // Choose an icon based on the type of reminder
  const Icon = reminder.type === 'plant' ? FaLeaf : FaHouseUser;

  // Choose a background color based on the group
  const bgColor =
    reminder.group === 'Plants'
      ? 'bg-green-100'
      : reminder.group === 'Household'
      ? 'bg-blue-100'
      : 'bg-pink-100';

  return (
    <div className={`${bgColor} p-4 rounded-lg shadow-md flex items-center`}>
      <div className="mr-4 text-3xl text-green-500">
        <Icon />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{reminder.title}</h3>
        <p className="text-gray-600">{reminder.description}</p>
        <p className="text-gray-500 text-sm">Due: {new Date(reminder.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ReminderCard;
