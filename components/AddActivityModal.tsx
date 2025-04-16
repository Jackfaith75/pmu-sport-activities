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
        {['name', 'description', 'date', 'time', 'location', 'organizer'].map((field) => (
          <div key={field}>
            <label className="capitalize block font-medium">{field}</label>
            <input
              className="border rounded w-full px-3 py-2"
              type={field === 'date' ? 'date' : field === 'time' ? 'time' : 'text'}
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div>
          <label className="block font-medium">Participants max</label>
          <input
            type="number"
            name="maxParticipants"
            className="border rounded w-full px-3 py-2"
            value={formData.maxParticipants}
            onChange={handleChange}
          />
        </div>
        <button className="bg-[#00553A] hover:bg-[#007C55] text-white px-4 py-2 rounded">
          Ajouter
        </button>
      </form>
    </Modal>
  );
}
