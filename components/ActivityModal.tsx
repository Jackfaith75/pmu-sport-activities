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
  const [isDateUndefined, setIsDateUndefined] = useState(false);

  useEffect(() => {
    if (activity && show) {
      setFormData(activity);
      setIsDateUndefined(activity.date === 'À définir');
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

  const handleToggleDateUndefined = () => {
    setIsDateUndefined(prev => {
      const newValue = !prev;
      if (newValue) {
        setFormData(prevForm => ({
          ...prevForm!,
          date: 'À définir',
          time: 'À définir',
        }));
      } else {
        setFormData(prevForm => ({
          ...prevForm!,
          date: '',
          time: '',
        }));
      }
      return newValue;
    });
  };

  const handleSubmitEdit = async (e: any) => {
    e.preventDefault();
    if (!formData) return;

    const res = await fetch('/api/activities', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert('Activité modifiée avec succès !');
      onClose();
    } else {
      alert("Erreur lors de la modification.");
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (!activity) return;

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityId: activity.id, fullName })
    });

    if (res.ok) {
      alert('Inscription réussie !');
      setFullName('');
      fetch(`/api/participants?id=${activity.id}`)
        .then(res => res.json())
        .then(data => {
          const names = data.map((r: any) => r.fullName);
          setParticipants(names);
        });
    } else {
      alert("Erreur ou déjà inscrit !");
    }
  };

  const handleRemoveParticipant = async (name: string) => {
    if (!formData) return;

    const confirmed = confirm(`Supprimer ${name} ?`);
    if (!confirmed) return;

    const res = await fetch('/api/unregister', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activityId: formData.id,
        fullName: name,
      }),
    });

    if (res.ok) {
      const updated = participants.filter((n) => n !== name);
      setParticipants(updated);
    } else {
      alert('Erreur lors de la suppression.');
    }
  };

  if (!formData) return null;

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/activite/${formData.id}`;

  return (
    <Modal show={show} onClose={onClose}>
      <h2 className="text-xl font-bold mb-2">{formData.name}</h2>
      <p className="text-sm text-gray-600 mb-2">
        📍 {formData.location} | 🗓️ {formData.date !== 'À définir' ? formData.date : '⏳ À définir'}
        {formData.time && formData.time !== 'À définir' && ` à ${formData.time}`}
      </p>
      <p className="mb-4">{formData.description}</p>

      {/* Partage lien */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">🔗 Lien de partage :</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full text-sm bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-600"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert('✅ Lien copié dans le presse-papiers !');
            }}
            className="bg-[#00553A] hover:bg-[#007C55] text-white px-3 py-1 rounded text-sm"
          >
            Copier
          </button>
        </div>
      </div>

      {/* Liste Participants */}
      <div className="mb-4">
        <strong>👥 {participants.length} / {formData.maxParticipants} participants</strong>
        <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
          {participants.map((name, i) => (
            <li key={i} className="flex items-center justify-between pr-2">
              <span>{name}</span>
              {mode === 'edit' && (
                <button
                  title="Supprimer l'inscription"
                  onClick={() => handleRemoveParticipant(name)}
                  className="text-red-500 hover:text-red-700 text-lg ml-2"
                >
                  ❌
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Edition / Inscription */}
      {mode === 'edit' ? (
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <div>
            <label className="block font-medium">Activité proposée</label>
            <input
              className="border rounded w-full px-3 py-2"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              className="border rounded w-full px-3 py-2"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <label className="block font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={isDateUndefined ? '' : formData.date}
                onChange={handleChange}
                disabled={isDateUndefined}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required={!isDateUndefined}
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="undefinedDateEdit"
                checked={isDateUndefined}
                onChange={handleToggleDateUndefined}
                className="mr-2"
              />
              <label htmlFor="undefinedDateEdit" className="text-sm">À définir</label>
            </div>
          </div>

          {!isDateUndefined && (
            <div>
              <label className="block font-medium">Heure</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Sélectionnez une heure</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-medium">Lieu</label>
            <input
              className="border rounded w-full px-3 py-2"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Organisateur</label>
            <input
              className="border rounded w-full px-3 py-2"
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Participants max</label>
            <input
              className="border rounded w-full px-3 py-2"
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="bg-[#00553A] hover:bg-[#007C55] text-white px-6 py-3 rounded-md font-semibold w-full"
          >
            Enregistrer
          </button>
        </form>
      ) : (
        participants.length >= formData.maxParticipants ? (
          <p className="text-red-600 font-semibold mt-4">Activité complète</p>
        ) : (
          <form onSubmit={handleRegister} className="flex gap-2 items-center mt-4">
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Nom Prénom"
              className="flex-1 border rounded px-3 py-2"
              required
            />
            <button
              type="submit"
              className="bg-[#00553A] hover:bg-[#007C55] text-white px-4 py-2 rounded"
            >
              S'inscrire
            </button>
          </form>
        )
      )}
    </Modal>
  );
}
