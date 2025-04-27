import { useState } from 'react';
import { useRouter } from 'next/router';
import Modal from './Modal';

interface Props {
  show: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function AddActivityModal({ show, onClose, onAdd }: Props) {
  const router = useRouter();

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

  const [isDateUndefined, setIsDateUndefined] = useState(false); // ✅ Toggle pour date

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleDateUndefined = () => {
    setIsDateUndefined(prev => {
      const newValue = !prev;
      if (newValue) {
        setFormData(prevForm => ({
          ...prevForm,
          date: 'À définir',
          time: 'À définir'
        }));
      } else {
        setFormData(prevForm => ({
          ...prevForm,
          date: '',
          time: ''
        }));
      }
      return newValue;
    });
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
      onAdd();
      onClose();
      router.reload();
    } else {
      alert("Erreur lors de l'ajout.");
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">Ajouter une activité</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nom */}
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

        {/* Description */}
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

        {/* Date + Toggle */}
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
              id="undefinedDate"
              checked={isDateUndefined}
              onChange={handleToggleDateUndefined}
              className="mr-2"
            />
            <label htmlFor="undefinedDate" className="text-sm">À définir</label>
          </div>
        </div>

        {/* Heure */}
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
              <option value="À définir">⏳ À définir</option> {/* ✅ Toujours proposer "À définir" */}
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                  {i.toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lieu */}
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

        {/* Nombre Participants */}
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

        {/* Organisateur */}
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

        {/* Récurrence */}
        <div>
          <label className="block font-medium">Récurrence</label>
          <select
            name="recurrence"
            value={formData.recurrence}
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

        {/* Bouton Ajouter */}
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
