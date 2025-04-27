import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const registrationsFilePath = path.join(process.cwd(), 'data', 'registrations.json');

// Fonction pour lire les inscriptions existantes
const getRegistrations = () => {
  try {
    const data = fs.readFileSync(registrationsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Fonction pour sauvegarder les inscriptions
const saveRegistrations = (registrations: any) => {
  fs.writeFileSync(registrationsFilePath, JSON.stringify(registrations, null, 2));
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { activityId, fullName } = req.body;

  if (!activityId || !fullName) {
    res.status(400).json({ message: 'activityId et fullName sont requis' });
    return;
  }

  // Charger les inscriptions existantes
  const registrations = getRegistrations();

  // Vérifier que l'utilisateur n'est pas déjà inscrit
  const alreadyRegistered = registrations.some((r: any) => r.activityId === activityId && r.fullName === fullName);
  if (alreadyRegistered) {
    return res.status(409).json({ message: 'Déjà inscrit à cette activité' });
  }

  // Ajouter l'inscription
  const newRegistration = { activityId, fullName };
  registrations.push(newRegistration);

  // Sauvegarder dans le fichier
  saveRegistrations(registrations);

  res.status(201).json({ message: 'Inscription réussie !' });
}
