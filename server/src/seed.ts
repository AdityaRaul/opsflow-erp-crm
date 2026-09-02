import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { pool, query } from './db.js';

async function seed() {
  await pool.query(
    fs.readFileSync(
      path.join(process.cwd(), 'src/schema.sql'),
      'utf8'
    )
  );

  const password = await bcrypt.hash('Password@123', 10);

  const users = [
    ['Admin User', 'admin@opsflow.test', 'ADMIN'],
    ['Sales User', 'sales@opsflow.test', 'SALES'],
    ['Warehouse User', 'warehouse@opsflow.test', 'WAREHOUSE'],
    ['Accounts User', 'accounts@opsflow.test', 'ACCOUNTS']
  ];

  for (const [name, email, role] of users) {
    await query(
      `
      INSERT INTO users(name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT(email) DO NOTHING
      `,
      [name, email, password, role]
    );
  }

  console.log('Seed complete.');
  console.log('Password for all users: Password@123');

  await pool.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
