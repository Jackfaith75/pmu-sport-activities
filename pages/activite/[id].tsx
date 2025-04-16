import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (id) {
      fetch(`/api/activities/${id}`)
        .then((res) => res.json())
        .then((data) => setActivity(data));
    }
  }, [id]);

  if (!activity) return <p>Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#00553A] mb-4">{activity.name}</h1>
      <p className="mb-2">📍 {activity.location}</p>
      <p className="mb-2">🗓️ {activity.date} à {activity.time}</p>
      <p className="mb-4">{activity.description}</p>
      <p className="mb-2">
        👥 {activity.registered} / {activity.maxParticipants} participants
      </p>
      {/* Ajouter ici les boutons Modifier et S'inscrire si nécessaire */}
    </div>
  );
}
