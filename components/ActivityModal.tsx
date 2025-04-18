import { useEffect, useState } from 'react';
import Modal from './Modal';

interface Activity {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  organizer: string;
  recurrence?: string;
  registered?: number;
}

interface Props {
  activity: Activity | null;
  show: boolean;
  onClose: () => void;
  mode?: 'view' | 'edit';
}

export default function ActivityModal({ activity, show, onClose, mode = 'view' }: Props) {
  const [formData, setFormData] = useState<Activity | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (activity && show) {
      setFormData(activity);
      fetch(`/api/participants?id=${activity.id}`)
        .then(res => res.json())
        .then(data => {
          const names = data.map((r: any) => r.fullName);
          setParticipants(names);
        });
    }
  }, [activity, show]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData((prev) => ({ ...prev!, [name]: value }));
  };

  const handleSubmitEdit = async (e: any) => {
    e.preventDefault();
    if (!formData) return;

    const res = await fetch('/api/activities', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Activité modifiée avec succès !');
      onClose();
    } else {
      alert('Erreur lors de la modification');
    }
  };

  if (!formData) return null;

  return (
    <Modal show={show} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">
        {mode === 'edit' ? 'Modifier' : 'Voir'} l'activité
      </h2>

      {mode === 'view' ? (
        <div className="space-y-2">
          <p><strong>Activité :</strong> {formData.name}</p>
          <p><strong>Description :</strong> {formData.description}</p>
          <p><strong>Date :</strong> {formData.date}</p>
          <p><strong>Heure :</strong> {formData.time}</p>
          <p><strong>Lieu :</strong> {formData.location}</p>
          <p><strong>Organisateur :</strong> {formData.organizer}</p>
          <p><strong>Max participants :</strong> {formData.maxParticipants}</p>
          <p><strong>Récurrence :</strong> {formData.recurrence || 'Aucune'}</p>
          <p><strong>Participants inscrits :</strong></p>
          <ul className="list-disc pl-5">
            {participants.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      ) : (
        <form onSubmit={handleSubmitEdit} className="space-y-3">
          {[
            ['name', 'Activité'],
            ['description', 'Description'],
            ['date', 'Date', 'date'],
            ['time', 'Heure', 'time'],
            ['location', 'Lieu'],
            ['organizer', 'Organisateur'],
            ['maxParticipants', 'Max participants', 'number'],
          ].map(([key, label, type = 'text']) => (
            <div key={key}>
              <label className="block font-medium">{label}</label>
              <input
                type={type}
                name={key}
                value={formData[key as keyof Activity] as string}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          ))}

          {/* Champ de récurrence */}
          <div>
            <label className="block font-medium">Récurrence</label>
            <select
              name="recurrence"
              value={formData.recurrence || 'none'}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="none">Aucune</option>
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="biweekly">Tous les 15 jours</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#00553A] hover:bg-[#007C55] text-white px-6 py-3 rounded-md font-semibold w-full"
          >
            Sauvegarder
          </button>
        </form>
      )}
    </Modal>
  );
}
