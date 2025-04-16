import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'activities.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = fs.readFileSync(filePath, 'utf-8');
    res.status(200).json(JSON.parse(data));
  } else if (req.method === 'POST') {
    const newAct = { ...req.body, id: Date.now().toString(), registered: 0 };

    const data = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      : [];

    data.push(newAct);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(201).json({ message: 'Activity added' });
  } else if (req.method === 'PUT') {
    const updated = req.body;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const index = data.findIndex((act) => act.id === updated.id);
    if (index === -1) return res.status(404).json({ message: "Activity not found" });

    data[index] = { ...data[index], ...updated };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(200).json({ message: 'Activity updated' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
