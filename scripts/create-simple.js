/**
 * Create Collections - Simplified
 */

const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

async function createCollections() {
  console.log('🚀 Creating Collections\n');

  const pb = new PocketBase(POCKETBASE_URL);
  await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
  console.log('✅ Authenticated\n');

  const collections = await pb.collections.getFullList();
  const usersId = collections.find(c => c.name === 'users').id;
  const patientsId = collections.find(c => c.name === 'patients').id;
  
  console.log('Users ID:', usersId);
  console.log('Patients ID:', patientsId);
  console.log('');

  // Delete existing
  console.log('🗑️  Cleaning up...');
  for (const name of ['notes', 'templates', 'user_settings']) {
    const col = collections.find(c => c.name === name);
    if (col) {
      await pb.collections.delete(col.id);
      console.log(`   Deleted ${name}`);
    }
  }
  console.log('');

  // Create notes - minimal fields first
  console.log('📦 Creating notes collection...');
  try {
    const notes = await pb.collections.create({
      name: 'notes',
      type: 'base',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      fields: [
        {
          id: 'field1',
          name: 'user',
          type: 'relation',
          required: true,
          options: {
            collectionId: usersId,
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: null
          }
        },
        {
          id: 'field2',
          name: 'patient',
          type: 'relation',
          required: false,
          options: {
            collectionId: patientsId,
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: null
          }
        },
        { name: 'chief_complaint', type: 'text', required: false },
        { name: 'appointment_date', type: 'date', required: false },
        { name: 'appointment_time', type: 'text', required: true },
        { name: 'status', type: 'text', required: false },
        { name: 'soap_subjective', type: 'text', required: false },
        { name: 'soap_objective', type: 'text', required: false },
        { name: 'soap_assessment', type: 'text', required: false },
        { name: 'soap_plan', type: 'text', required: false },
      ],
    });
    console.log('✅ Created notes\n');
  } catch (error) {
    console.error('❌ Failed:', error.response?.data || error.message);
    console.error('\nFull error:', JSON.stringify(error.response, null, 2));
  }

  // Create templates
  console.log('📦 Creating templates collection...');
  try {
    await pb.collections.create({
      name: 'templates',
      type: 'base',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: false,
          options: {
            collectionId: usersId,
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: null
          }
        },
        { name: 'chief_complaint', type: 'text', required: false },
        { name: 'soap_subjective', type: 'text', required: false },
        { name: 'soap_objective', type: 'text', required: false },
        { name: 'soap_assessment', type: 'text', required: false },
        { name: 'soap_plan', type: 'text', required: false },
      ],
    });
    console.log('✅ Created templates\n');
  } catch (error) {
    console.error('❌ Failed:', error.response?.data || error.message);
  }

  // Create user_settings
  console.log('📦 Creating user_settings collection...');
  try {
    await pb.collections.create({
      name: 'user_settings',
      type: 'base',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: {
            collectionId: usersId,
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: null
          }
        },
        { name: 'appointment_types', type: 'json', required: false },
        { name: 'appointment_types_default', type: 'text', required: false },
      ],
    });
    console.log('✅ Created user_settings\n');
  } catch (error) {
    console.error('❌ Failed:', error.response?.data || error.message);
  }

  console.log('✨ Done!\n');
}

createCollections().catch(console.error);
