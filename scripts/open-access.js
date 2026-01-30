/**
 * Set Open Access Rules (temporary fix)
 * This allows all authenticated users to access all collections
 */

const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

async function setOpenAccess() {
  console.log('🔓 Setting Open Access Rules\n');

  const pb = new PocketBase(POCKETBASE_URL);
  await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
  console.log('✅ Authenticated\n');

  const collections = await pb.collections.getFullList();
  
  const toUpdate = ['notes', 'templates', 'user_settings', 'patients'];
  
  for (const name of toUpdate) {
    const collection = collections.find(c => c.name === name);
    if (collection) {
      console.log(`📝 Updating ${name}...`);
      try {
        await pb.collections.update(collection.id, {
          listRule: '@request.auth.id != ""',
          viewRule: '@request.auth.id != ""',
          createRule: '@request.auth.id != ""',
          updateRule: '@request.auth.id != ""',
          deleteRule: '@request.auth.id != ""',
        });
        console.log(`✅ Updated ${name}\n`);
      } catch (error) {
        console.error(`❌ Failed:`, error.message, '\n');
      }
    }
  }

  console.log('✨ Done! Try accessing the dashboard now.\n');
}

setOpenAccess().catch(console.error);
