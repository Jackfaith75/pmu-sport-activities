import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ActivityForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 10,
    organizer: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert('✅ Activité ajoutée avec succès !');
      router.push('/');
    } else {
      alert('❌ Une erreur est survenue. Merci de réessayer.');
    }
  };

  const getLabel = (field: string) => {
    switch (field) {
      case 'name':
        return 'Activité proposée';
      case 'location':
        return 'Localisation';
      case 'description':
        return 'Description';
      case 'date':
        return 'Date';
      case 'time':
        return 'Heure';
      case 'organizer':
        return 'Organisateur';
      default:
        return field;
    }
  };

  return (
    <form
      className="space-y-6 max-w-xl bg-white p-6 shadow-md rounded-lg mt-6"
      onSubmit={handleSubmit}
    >
      {['name', 'description', 'date', 'time', 'location', 'organizer'].map(field => (
        <div key={field}>
          <label className="block font-medium mb-1">{getLabel(field)}</label>
          <input
            type={field === 'date' ? 'date' : field === 'time' ? 'time' : 'text'}
            name={field}
            value={(formData as any)[field]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
      ))}
      <div>
        <label className="block font-medium mb-1">Participants max</label>
        <input
          type="number"
          name="maxParticipants"
          value={formData.maxParticipants}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-[#00553A] hover:bg-[#007C55] text-white px-6 py-2 rounded font-semibold shadow"
      >
        Ajouter l'activité
      </button>
    </form>
  );
}
