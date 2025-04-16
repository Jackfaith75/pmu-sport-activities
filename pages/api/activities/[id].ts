import { NextApiRequest, NextApiResponse } from 'next';
import activities from '../../../data/activities.json'; // Assurez-vous que ce chemin est correct

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const activity = activities.find((act) => act.id === id);

  if (activity) {
    res.status(200).json(activity);
  } else {
    res.status(404).json({ message: 'Activité non trouvée' });
  }
}
