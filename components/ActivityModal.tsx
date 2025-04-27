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
        📍 {formData.location} | 🗓️ {formData.date !== 'À définir' ? formData.date : '⏳ Date à définir'}
        {formData.time && formData.time !== 'À définir' && ` à ${formData.time}`}
      </p>
      <p className="mb-4">{formData.description}</p>

      {/* 🔗 Partage lien */}
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

      {/* Participants */}
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

      {/* Formulaire */}
      {mode === 'edit' ? (
        <form onSubmit={handleSubmitEdit} className="space-y-3">
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
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium">Date</label>
              <select
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Sélectionnez une date</option>
                <option value="À définir">⏳ À définir</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-medium">Heure</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Sélectionnez une heure</option>
                <option value="À définir">⏳ À définir</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
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

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="bg-[#00553A] hover:bg-[#007C55] text-white px-4 py-2 rounded"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!confirm("Confirmer la suppression de cette activité ?")) return;

                const res = await fetch('/api/delete-activity', {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: formData.id })
                });

                if (res.ok) {
                  alert("Activité supprimée !");
                  onClose();
                } else {
                  alert("Erreur lors de la suppression.");
                }
              }}
              className="bg-[#00553A] hover:bg-[#007C55] text-white px-4 py-2 rounded"
            >
              Supprimer l’activité
            </button>
          </div>
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
