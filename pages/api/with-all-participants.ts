// /pages/api/with-all-participants.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import activities from '../../data/activities.json';

// ➡️ Stockage des participants en mémoire
let participants: { activityId: string, fullName: string }[] = [];

// Charger en mémoire existante (si besoin un jour)
try {
  participants = require('../../data/registrations.json');
} catch (error) {
  participants = [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allData = activities.map((activity) => {
      const activityParticipants = participants.filter((p) => p.activityId === activity.id);
      return {
        activityId: activity.id,
        activityName: activity.name,
        participants: activityParticipants
      };
    });

    res.status(200).json(allData);
  } catch (error) {
    console.error('Erreur API all participants:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
