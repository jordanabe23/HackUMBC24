'use client';

import CountUp from 'react-countup';

const StatisticCard = ({ end, label, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-md flex-1`}>
      <CountUp
        start={0}
        end={end}
        duration={2.5}
        separator=","
        className={`${textColor} text-4xl font-bold`}
      />
      <p className="mt-2 text-gray-700 text-lg">{label}</p>
    </div>
  );
};

export default StatisticCard;
