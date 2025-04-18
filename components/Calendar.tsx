import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ActivityModal from './ActivityModal';
import AddActivityModal from './AddActivityModal';

interface Activity {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  location: string;
  maxParticipants: number;
  organizer: string;
  registered: number;
}

export default function Calendar() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // 🔧 nouvel état pour la modale d’ajout

  // Fonction pour charger les activités
  const fetchActivities = () => {
    fetch('/api/with-registrations')
      .then(res => res.json())
      .then(data => setActivities(data));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Préparer les événements pour FullCalendar
  const events = activities.map(act => ({
    id: act.id,
    title: act.name,
    date: act.date.split('T')[0], // 🛠️ on garde uniquement la date (pas l'heure)
  }));

  // Ouvrir la modale d'une activité depuis le calendrier
  const handleEventClick = (info: any) => {
    const act = activities.find(a => a.id === info.event.id);
    if (act) {
      setSelectedActivity(act);
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-10 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
      {/* ➕ Bouton pour ouvrir la modale d'ajout */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#00553A] hover:bg-[#007C55] text-white font-bold px-4 py-2 rounded-md"
        >
          ➕ Ajouter une activité
        </button>
      </div>

      {/* Calendrier */}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        eventClassNames={() => 'cursor-pointer hover:bg-[#00553A] transition-all rounded-md'}
        height="auto"
      />

      {/* Modale de consultation/modification d'une activité */}
      <ActivityModal
        activity={selectedActivity}
        show={showModal}
        onClose={handleClose}
      />

      {/* Modale d'ajout avec rechargement automatique à la fermeture */}
      <AddActivityModal
  show={showAddModal}
  onClose={() => setShowAddModal(false)}
  onAdd={fetchActivities} // ✅ nouvelle prop à fournir
/>
    </div>
  );
}
