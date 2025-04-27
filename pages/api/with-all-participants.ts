// /pages/api/with-all-participants.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';
import activities from '../../data/activities.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await db.query('SELECT activity_id, full_name FROM registrations');

    const participantsByActivity = activities.map((activity) => {
      const participants = result.rows
        .filter((p) => p.activity_id === activity.id)
        .map((p) => ({ fullName: p.full_name }));

      return {
        activityId: activity.id,
        activityName: activity.name,
        participants
      };
    });

    res.status(200).json(participantsByActivity);
  } catch (error) {
    console.error('Erreur API all participants:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
