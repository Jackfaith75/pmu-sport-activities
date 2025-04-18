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
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert("Activité ajoutée !");
      onAdd(); // recharge tableau
      onClose(); // ferme modal
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
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Heure</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Localisation</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Participants max</label>
          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Organisateur</label>
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>
        <button className="bg-[#00553A] hover:bg-[#007C55] text-white px-4 py-2 rounded">
          Ajouter
        </button>
      </form>
    </Modal>
  );
}
