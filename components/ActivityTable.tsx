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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const activitiesPerPage = 6;

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

  // Pagination calculs
  const indexOfLast = currentPage * activitiesPerPage;
  const indexOfFirst = indexOfLast - activitiesPerPage;
  const currentActivities = activities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(activities.length / activitiesPerPage);

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
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="px-6 py-3">Nom</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Heure</th>
            <th className="px-6 py-3">Lieu</th>
            <th className="px-6 py-3">Places</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentActivities.map((activity) => (
            <tr key={activity.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{activity.name}</td>
              <td className="px-6 py-4">{activity.date}</td>
              <td className="px-6 py-4">{activity.time}</td>
              <td className="px-6 py-4">{activity.location}</td>
              <td className="px-6 py-4">
                {activity.registered} / {activity.maxParticipants}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => openModal(activity, 'view')}
                  className="text-blue-600 hover:underline"
                >
                  Voir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 p-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Suivant
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
        onClose={handleClose}
      />
    </div>
  );
}
