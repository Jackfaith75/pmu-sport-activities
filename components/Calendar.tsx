import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ActivityModal from './ActivityModal';

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

  useEffect(() => {
    fetch('/api/with-registrations')
      .then(res => res.json())
      .then(data => setActivities(data));
  }, []);

  const events = activities.map(act => ({
    id: act.id,
    title: act.name,
    date: act.date.split('T')[0], // 🛠️ S'assure que seul le jour est pris
  }));

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
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        eventClassNames={() => 'cursor-pointer hover:bg-[#00553A] transition-all rounded-md'}
        height="auto"
      />

      <ActivityModal
        activity={selectedActivity}
        show={showModal}
        onClose={handleClose}
      />
    </div>
  );
}
