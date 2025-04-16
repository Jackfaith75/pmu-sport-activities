import Head from 'next/head';
import Header from '../components/Header';
import ActivityTable from '../components/ActivityTable';
import Calendar from '../components/Calendar';

export default function Home() {
  return (
    <>
      <Head>
        <title>Activités Sportives PMU</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* ✅ Police Inter pour un design moderne */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Header />

      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Liste des activités</h1>
        
        {/* ✅ Tableau des activités */}
        <ActivityTable />

        {/* ✅ Calendrier interactif */}
        <Calendar />
      </main>
    </>
  );
}
