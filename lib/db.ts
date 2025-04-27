// /lib/db.ts

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // 🔥 L'URL qu'on va configurer
});

export default pool;
