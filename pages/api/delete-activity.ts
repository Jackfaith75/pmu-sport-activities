import fs from 'fs';
import path from 'path';

const actPath = path.join(process.cwd(), 'data', 'activities.json');
const regPath = path.join(process.cwd(), 'data', 'registrations.json');

export default function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const { id } = req.body;

  // Supprimer l'activité
  const activities = fs.existsSync(actPath)
    ? JSON.parse(fs.readFileSync(actPath, 'utf-8'))
    : [];

  const newActivities = activities.filter((a: any) => a.id !== id);
  fs.writeFileSync(actPath, JSON.stringify(newActivities, null, 2));

  // Supprimer les participants liés
  const registrations = fs.existsSync(regPath)
    ? JSON.parse(fs.readFileSync(regPath, 'utf-8'))
    : [];

  const newRegistrations = registrations.filter((r: any) => r.activityId !== id);
  fs.writeFileSync(regPath, JSON.stringify(newRegistrations, null, 2));

  res.status(200).json({ message: 'Activité supprimée avec succès' });
}
