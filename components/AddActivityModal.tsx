import { useState } from 'react';
import Modal from './Modal';

interface Props {
  show: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function AddActivityModal({ show, onClose, onAdd }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 10,
    organizer: '',
    recurrence: 'none',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Activité ajoutée !');
      onAdd(); // 🔄 Recharge les activités dans ActivityTable
      onClose(); // ❌ Ferme la modal
    } else {
      alert("Erreur lors de l'ajout.");
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Ajouter une activité</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block font-medium">Activité proposée</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Heure</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Lieu</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Nombre maximum de participants</label>
          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            min={1}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Organisateur</label>
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* Champ récurrence (optionnel) */}
        <div>
          <label className="block font-medium">Récurrence</label>
          <select
            name="recurrence"
            value={formData.recurrence}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, recurrence: e.target.value }))
            }
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
          Ajouter l'activité
        </button>
      </form>
    </Modal>
  );
}
