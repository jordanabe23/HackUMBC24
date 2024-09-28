import Head from 'next/head';


const Calendar = () => {
  return (
      <div className="flex-1 bg-slate-50 min-h-screen p-6">
        <Head>
          <title>Chat - Group Reminders</title>
          <meta name="description" content="Chat with your team" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1 className="text-3xl font-bold text-gray-800">Calendar Page</h1>
        {/* Chat functionality goes here */}
      </div>
  );
};

export default Calendar;