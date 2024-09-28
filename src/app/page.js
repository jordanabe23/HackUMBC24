// app/page.js
import Head from 'next/head';
import DashboardClientWrapper from '../components/DashboardClientWrapper';

export default function Home() {
  return (
    <>
      <Head>
        <title>Group Reminders Dashboard</title>
        <meta name="description" content="Dashboard for group reminders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardClientWrapper />
    </>
  );
}
