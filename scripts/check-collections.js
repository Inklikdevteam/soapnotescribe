/**
 * Check Collection Schemas
 */

const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

async function checkCollections() {
  const pb = new PocketBase(POCKETBASE_URL);
  await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
  
  const collections = await pb.collections.getFullList();
  
  console.log('\n📋 Collections and their fields:\n');
  
  for (const collection of collections) {
    if (['notes', 'templates', 'user_settings', 'patients'].includes(collection.name)) {
      console.log(`\n${collection.name} (${collection.id}):`);
      console.log('  Fields:', collection.schema ? collection.schema.map(f => f.name).join(', ') : 'No schema');
      console.log('  List Rule:', collection.listRule || 'null');
      console.log('  View Rule:', collection.viewRule || 'null');
    }
  }
  console.log('\n');
}

checkCollections().catch(console.error);
