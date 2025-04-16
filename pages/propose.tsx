import Head from 'next/head';
import Header from '../components/Header';
import ActivityForm from '../components/ActivityForm';

export default function ProposeActivity() {
  return (
    <>
      <Head>
        <title>Proposer une Activité</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Proposer une activité</h1>
        <ActivityForm />
      </main>
    </>
  );
}
