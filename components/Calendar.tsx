import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ActivityModal from './ActivityModal';
import { addDays, addWeeks, addMonths, format } from 'date-fns';

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
  recurrence?: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
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

  // 🔁 Générer les occurrences récurrentes
  function generateRecurringEvents(activity: Activity) {
    const recurrence = activity.recurrence || 'none';
    const originalDate = new Date(activity.date);
    const maxOccurrences = 6; // Modifier ce chiffre pour plus/moins de répétitions

    const occurrences = [];

    for (let i = 0; i < maxOccurrences; i++) {
      let newDate: Date;

      switch (recurrence) {
        case 'daily':
          newDate = addDays(originalDate, i);
          break;
        case 'weekly':
          newDate = addWeeks(originalDate, i);
          break;
        case 'biweekly':
          newDate = addWeeks(originalDate, i * 2);
          break;
        case 'monthly':
          newDate = addMonths(originalDate, i);
          break;
        default:
          if (i > 0) return occurrences; // Pas de répétition
          newDate = originalDate;
          break;
      }

      occurrences.push({
        id: `${activity.id}-${i}`,
        title: activity.name,
        date: format(newDate, 'yyyy-MM-dd'),
      });
    }

    return occurrences;
  }

  const events = activities.flatMap(generateRecurringEvents);

  const handleEventClick = (info: any) => {
    const act = activities.find(a => info.event.id.startsWith(a.id));
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
        mode="view"
      />
    </div>
  );
}
