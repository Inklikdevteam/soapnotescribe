/**
 * Fix API Rules for Collections
 * This adds proper access rules so users can access their data
 */

const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

async function fixApiRules() {
  console.log('🔧 Fixing API Rules\n');

  const pb = new PocketBase(POCKETBASE_URL);

  // Authenticate
  await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
  console.log('✅ Authenticated\n');

  // Get all collections
  const collections = await pb.collections.getFullList();

  // Update notes collection
  const notesCollection = collections.find(c => c.name === 'notes');
  if (notesCollection) {
    console.log('📝 Updating notes collection rules...');
    try {
      await pb.collections.update(notesCollection.id, {
        listRule: '@request.auth.id != "" && user = @request.auth.id',
        viewRule: '@request.auth.id != "" && user = @request.auth.id',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != "" && user = @request.auth.id',
        deleteRule: '@request.auth.id != "" && user = @request.auth.id',
      });
      console.log('✅ Updated notes rules\n');
    } catch (error) {
      console.error('❌ Failed:', error.message, '\n');
    }
  }

  // Update templates collection
  const templatesCollection = collections.find(c => c.name === 'templates');
  if (templatesCollection) {
    console.log('📝 Updating templates collection rules...');
    try {
      await pb.collections.update(templatesCollection.id, {
        listRule: '@request.auth.id != "" && user = @request.auth.id',
        viewRule: '@request.auth.id != "" && user = @request.auth.id',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != "" && user = @request.auth.id',
        deleteRule: '@request.auth.id != "" && user = @request.auth.id',
      });
      console.log('✅ Updated templates rules\n');
    } catch (error) {
      console.error('❌ Failed:', error.message, '\n');
    }
  }

  // Update user_settings collection
  const settingsCollection = collections.find(c => c.name === 'user_settings');
  if (settingsCollection) {
    console.log('📝 Updating user_settings collection rules...');
    try {
      await pb.collections.update(settingsCollection.id, {
        listRule: '@request.auth.id != "" && user = @request.auth.id',
        viewRule: '@request.auth.id != "" && user = @request.auth.id',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != "" && user = @request.auth.id',
        deleteRule: '@request.auth.id != "" && user = @request.auth.id',
      });
      console.log('✅ Updated user_settings rules\n');
    } catch (error) {
      console.error('❌ Failed:', error.message, '\n');
    }
  }

  // Update patients collection
  const patientsCollection = collections.find(c => c.name === 'patients');
  if (patientsCollection) {
    console.log('📝 Updating patients collection rules...');
    try {
      await pb.collections.update(patientsCollection.id, {
        listRule: '@request.auth.id != ""',
        viewRule: '@request.auth.id != ""',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != ""',
        deleteRule: '@request.auth.id != ""',
      });
      console.log('✅ Updated patients rules\n');
    } catch (error) {
      console.error('❌ Failed:', error.message, '\n');
    }
  }

  console.log('✨ Done! API rules updated.\n');
  console.log('Try accessing your dashboard now: http://localhost:3000/dashboard/notes\n');
}

fixApiRules().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
