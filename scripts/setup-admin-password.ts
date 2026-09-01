/**
 * One-time script to set a bcrypt-hashed password for the admin user.
 * Run: bun run scripts/setup-admin-password.ts
 */
import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = 'admin@rwextech.com';
const DEFAULT_PASSWORD = 'Admin@2025'; // CHANGE THIS in production!

async function main() {
  const user = await db.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (!user) {
    console.error(`❌ User ${ADMIN_EMAIL} not found.`);
    process.exit(1);
  }

  if (user.password) {
    const isValid = await bcrypt.compare(DEFAULT_PASSWORD, user.password);
    if (isValid) {
      console.log('✅ Admin password already set and matches.');
      process.exit(0);
    }
    console.log('⚠️  Admin already has a different password. Re-setting...');
  }

  const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  await db.user.update({
    where: { email: ADMIN_EMAIL },
    data: { password: hashed },
  });

  console.log(`✅ Password set for ${ADMIN_EMAIL}`);
  console.log(`   Default password: ${DEFAULT_PASSWORD}`);
  console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!\n');
}

main().catch(console.error).finally(() => process.exit(0));
