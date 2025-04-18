import Head from 'next/head';
import Image from 'next/image';
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

      <Header />

      {/* ✅ Image d'accueil */}
      <div className="relative w-full">
        <Image
          src="/images/pmu-banner.png"
          alt="Illustration activités sportives PMU"
          width={1792}
          height={1024}
          layout="responsive"
          priority
        />
      </div>

      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-[#00553A]">Liste des activités</h1>

        <ActivityTable />
        <Calendar />
      </main>
    </>
  );
}
