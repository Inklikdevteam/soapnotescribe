/**
 * Reset Collections - Delete and Recreate
 */

const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

async function resetCollections() {
  console.log('🔄 Resetting Collections\n');

  const pb = new PocketBase(POCKETBASE_URL);
  await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
  console.log('✅ Authenticated\n');

  const collections = await pb.collections.getFullList();
  
  // Delete empty collections
  const toDelete = ['notes', 'templates', 'user_settings'];
  for (const name of toDelete) {
    const collection = collections.find(c => c.name === name);
    if (collection) {
      console.log(`🗑️  Deleting ${name}...`);
      try {
        await pb.collections.delete(collection.id);
        console.log(`✅ Deleted ${name}\n`);
      } catch (error) {
        console.error(`❌ Failed to delete ${name}:`, error.message, '\n');
      }
    }
  }

  console.log('✨ Done! Now run: npm run fix:collections\n');
}

resetCollections().catch(console.error);
