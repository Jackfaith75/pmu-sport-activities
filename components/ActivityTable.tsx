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
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

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

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = activities.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="overflow-x-auto mt-6 rounded-lg shadow-md border border-gray-200">

      {/* ➕ Bouton Ajouter */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#00553A] hover:bg-[#007C55] text-white font-semibold text-base px-6 py-3 rounded-md whitespace-nowrap"
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
          {paginatedActivities.map((act) => (
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

{/* Pagination ultra légère */}
<div className="flex justify-center items-center gap-2 py-3 text-xs text-[#00553A]">
  <button
    className="text-[#00553A] disabled:text-gray-300 hover:underline"
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    ◀
  </button>
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i + 1}
      className={`text-[#00553A] ${
        currentPage === i + 1 ? 'font-bold' : 'opacity-70'
      } hover:underline`}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}
  <button
    className="text-[#00553A] disabled:text-gray-300 hover:underline"
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    ▶
  </button>
</div>


      {/* Modales */}
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
