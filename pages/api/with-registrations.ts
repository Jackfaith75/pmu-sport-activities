import fs from 'fs';
import path from 'path';

const actPath = path.join(process.cwd(), 'data', 'activities.json');
const regPath = path.join(process.cwd(), 'data', 'registrations.json');

export default function handler(req, res) {
  const activities = fs.existsSync(actPath)
    ? JSON.parse(fs.readFileSync(actPath, 'utf-8'))
    : [];

  const registrations = fs.existsSync(regPath)
    ? JSON.parse(fs.readFileSync(regPath, 'utf-8'))
    : [];

  const enriched = activities.map((act: any) => {
    const count = registrations.filter((r: any) => r.activityId === act.id).length;
    return { ...act, registered: count };
  });

  res.status(200).json(enriched);
}
