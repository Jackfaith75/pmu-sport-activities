import fs from 'fs';
import path from 'path';

const regPath = path.join(process.cwd(), 'data', 'registrations.json');
const actPath = path.join(process.cwd(), 'data', 'activities.json');

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { activityId, fullName } = req.body;

  const registrations = fs.existsSync(regPath)
    ? JSON.parse(fs.readFileSync(regPath, 'utf-8'))
    : [];

  const exists = registrations.find(r => r.activityId === activityId && r.fullName === fullName);
  if (exists) return res.status(400).json({ message: 'Déjà inscrit' });

  // Ajouter l'inscription
  registrations.push({ activityId, fullName });
  fs.writeFileSync(regPath, JSON.stringify(registrations, null, 2));

  // 🔁 Mettre à jour le nombre d'inscrits dans activities.json
  const activities = fs.existsSync(actPath)
    ? JSON.parse(fs.readFileSync(actPath, 'utf-8'))
    : [];

  const index = activities.findIndex(a => a.id === activityId);
  if (index !== -1) {
    activities[index].registered = (activities[index].registered || 0) + 1;
    fs.writeFileSync(actPath, JSON.stringify(activities, null, 2));
  }

  res.status(200).json({ message: 'Inscription réussie' });
}
