import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db'; // 🛠 On utilise maintenant PostgreSQL avec ton fichier /lib/db.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { activityId, fullName } = req.body;

  if (!activityId || !fullName) {
    return res.status(400).json({ message: 'activityId et fullName requis' });
  }

  try {
    // Vérifier s'il est déjà inscrit
    const check = await db.query(
      'SELECT * FROM registrations WHERE activity_id = $1 AND full_name = $2',
      [activityId, fullName]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({ message: 'Déjà inscrit à cette activité' });
    }

    // Insérer l'inscription
    await db.query(
      'INSERT INTO registrations (activity_id, full_name) VALUES ($1, $2)',
      [activityId, fullName]
    );

    res.status(201).json({ message: 'Inscription réussie !' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
