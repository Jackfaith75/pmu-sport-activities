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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* 🌄 Image de fond en transparence */}
      <div className="relative min-h-screen overflow-hidden bg-gray-50">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url('/images/pmu-banner.png')`,
            opacity: 0.2,
          }}
        ></div>

        {/* 🧱 Contenu au-dessus de l'image */}
        <div className="relative z-10">
          <Header />

          <main className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-[#00553A]">Liste des activités</h1>

            {/* ✅ Tableau des activités */}
            <ActivityTable />

            {/* ✅ Calendrier interactif */}
            <Calendar />
          </main>
        </div>
      </div>
    </>
  );
}
