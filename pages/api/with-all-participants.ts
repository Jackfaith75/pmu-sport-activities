// /pages/api/with-all-participants.ts

import type { NextApiRequest, NextApiResponse } from 'next';

// Importe ta logique de récupération d'activités et de participants
import { getAllActivities, getParticipantsByActivityId } from '../../lib/database'; // ✅ à créer dans lib/database.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const activities = await getAllActivities();

    const allData = await Promise.all(
      activities.map(async (activity) => {
        const participants = await getParticipantsByActivityId(activity.id);
        return {
          activityId: activity.id,
          activityName: activity.name,
          participants: participants
        };
      })
    );

    res.status(200).json(allData);
  } catch (error) {
    console.error('Erreur API all participants:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

