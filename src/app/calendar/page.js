import CalendarComponent from '../../components/CalendarComponent'; // Ensure default export is used

const Calendar = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 min-h-screen p-6">
      <CalendarComponent className="w-full max-w-4xl h-full max-h-[800px]" />
    </div>
  );
};

export default Calendar;
