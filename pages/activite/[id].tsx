import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Activity {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  organizer: string;
  registered: number;
}

export default function ActivityDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [activity, setActivity] = useState<Activity | null>(null);
  const [fullName, setFullName] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetch(`/api/activities/${id}`)
        .then((res) => res.json())
        .then((data) => setActivity(data));

      fetch(`/api/participants?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          const names = data.map((r: any) => r.fullName);
          setParticipants(names);
        });
    }
  }, [id]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !id) return;

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityId: id, fullName })
    });

    if (res.ok) {
      alert('Inscription réussie !');
      setFullName('');

      fetch(`/api/participants?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          const names = data.map((r: any) => r.fullName);
          setParticipants(names);
        });
    } else {
      alert("Erreur lors de l'inscription.");
    }
  };

  if (!activity) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-50">
      <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-[#00553A] mb-4">{activity.name}</h1>
        <p className="text-sm text-gray-600 text-center mb-2">
          📍 {activity.location} | 🗓️ {activity.date} à {activity.time}
        </p>
        <p className="text-center mb-4">{activity.description}</p>

        <div className="mb-4 text-sm text-gray-700">
          <strong>👥 {participants.length} / {activity.maxParticipants} participants</strong>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {participants.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>

        {participants.length >= activity.maxParticipants ? (
          <p className="text-red-600 font-semibold mt-4 text-center">Activité complète</p>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-2 mt-4">
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Nom Prénom"
              className="border rounded px-3 py-2"
              required
            />
            <button
              type="submit"
              className="bg-[#00553A] hover:bg-[#007C55] text-white px-4 py-2 rounded"
            >
              S'inscrire
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/">
            <span className="text-[#00553A] hover:underline cursor-pointer">← Retour à l'accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
