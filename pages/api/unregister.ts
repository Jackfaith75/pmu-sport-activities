import fs from 'fs';
import path from 'path';

const regPath = path.join(process.cwd(), 'data', 'registrations.json');

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { activityId, fullName } = req.body;

  if (!activityId || !fullName) {
    return res.status(400).json({ message: 'Missing data' });
  }

  const registrations = fs.existsSync(regPath)
    ? JSON.parse(fs.readFileSync(regPath, 'utf-8'))
    : [];

  const updated = registrations.filter(
    (r) => !(r.activityId === activityId && r.fullName === fullName)
  );

  fs.writeFileSync(regPath, JSON.stringify(updated, null, 2));
  res.status(200).json({ message: 'Inscription supprimée' });
}
