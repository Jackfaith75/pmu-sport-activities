import { useEffect, useState } from 'react';
import ActivityModal from './ActivityModal';
import AddActivityModal from './AddActivityModal';

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

export default function ActivityTable() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchActivities = () => {
    fetch('/api/with-registrations')
      .then(res => res.json())
      .then(data => {
  const sorted = data.sort((a: Activity, b: Activity) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  setActivities(sorted);
});
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const openModal = (activity: Activity, mode: 'view' | 'edit' = 'view') => {
    setSelectedActivity(activity);
    setEditMode(mode === 'edit');
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    fetchActivities();
  };

  return (
    <div className="overflow-x-auto mt-6 rounded-lg shadow-md border border-gray-200">

      {/* ➕ Bouton Ajouter */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#00553A] hover:bg-[#007C55] text-white font-bold px-4 py-2 rounded-full text-lg"
          title="Ajouter une activité"
        >
          Proposer une activité
        </button>
      </div>

      {/* Tableau */}
      <table className="min-w-full bg-white">
        <thead className="bg-[#00553A] text-white">
          <tr>
            <th className="p-3"></th>
            <th className="p-3 text-left">Activité</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Heure</th>
            <th className="p-3 text-left">Lieu</th>
            <th className="p-3 text-left">Participants</th>
            <th className="p-3 text-left">Organisateur</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {activities.map((act) => (
            <tr
              key={act.id}
              className="border-t hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('button')) return;
                openModal(act, 'view');
              }}
            >
              <td className="p-3">
                <button
                  className="bg-[#00553A] hover:bg-[#007C55] text-white px-3 py-1 rounded text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(act, 'edit');
                  }}
                >
                  Modifier
                </button>
              </td>
              <td className="p-3">{act.name}</td>
              <td className="p-3">{act.date}</td>
              <td className="p-3">{act.time}</td>
              <td className="p-3">{act.location}</td>
              <td className="p-3">{act.registered}/{act.maxParticipants}</td>
              <td className="p-3">{act.organizer}</td>
              <td className="p-3">
                <button
                  className="bg-[#00553A] hover:bg-[#007C55] text-white px-3 py-1 rounded text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(act, 'view');
                  }}
                >
                  S'inscrire
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ActivityModal
        activity={selectedActivity}
        show={showModal}
        onClose={handleClose}
        mode={editMode ? 'edit' : 'view'}
      />

      <AddActivityModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={fetchActivities}
      />
    </div>
  );
}
