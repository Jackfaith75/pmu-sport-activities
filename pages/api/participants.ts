import fs from 'fs';
import path from 'path';

const regPath = path.join(process.cwd(), 'data', 'registrations.json');

export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Missing activity ID" });
  }

  const registrations = fs.existsSync(regPath)
    ? JSON.parse(fs.readFileSync(regPath, 'utf-8'))
    : [];

  const filtered = registrations.filter(r => r.activityId === id);
  res.status(200).json(filtered);
}
