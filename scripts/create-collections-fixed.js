/**
 * Create Collections with Proper Field Syntax
 */

const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

async function createCollections() {
  console.log('🚀 Creating Collections with Fields\n');

  const pb = new PocketBase(POCKETBASE_URL);
  await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
  console.log('✅ Authenticated\n');

  const collections = await pb.collections.getFullList();
  const usersCollection = collections.find(c => c.name === 'users');
  const patientsCollection = collections.find(c => c.name === 'patients');

  // Delete existing empty collections
  console.log('🗑️  Deleting old collections...');
  for (const name of ['notes', 'templates', 'user_settings']) {
    const col = collections.find(c => c.name === name);
    if (col) {
      await pb.collections.delete(col.id);
      console.log(`   Deleted ${name}`);
    }
  }
  console.log('');

  // Create notes collection
  console.log('📦 Creating notes collection...');
  const notes = await pb.collections.create({
    name: 'notes',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    fields: [
      { name: 'user', type: 'relation', required: true, options: { collectionId: usersCollection.id, maxSelect: 1 } },
      { name: 'patient', type: 'relation', options: { collectionId: patientsCollection.id, maxSelect: 1 } },
      { name: 'chief_complaint', type: 'text' },
      { name: 'appointment_date', type: 'date' },
      { name: 'appointment_time', type: 'text', required: true },
      { name: 'appointment_type', type: 'text' },
      { name: 'appointment_specialty', type: 'text' },
      { name: 'appointment_summary', type: 'text' },
      { name: 'audio_transcript', type: 'text' },
      { name: 'audio_file', type: 'file', options: { maxSelect: 1, maxSize: 104857600 } },
      { name: 'pdf_file', type: 'file', options: { maxSelect: 1, maxSize: 10485760 } },
      { name: 'soap_subjective', type: 'text' },
      { name: 'soap_objective', type: 'text' },
      { name: 'soap_assessment', type: 'text' },
      { name: 'soap_plan', type: 'text' },
      { name: 'patient_instructions', type: 'text' },
      { name: 'differential_diagnosis', type: 'text' },
      { name: 'discharge_instructions', type: 'text' },
      { name: 'allergies', type: 'text' },
      { name: 'patient_age_years', type: 'number' },
      { name: 'patient_location', type: 'text' },
      { name: 'status', type: 'text' },
      { name: 'consent', type: 'bool' },
      { name: 'doctor_signature', type: 'text' },
      { name: 'feedback', type: 'text' },
      { name: 'transcription_cost', type: 'number' },
      { name: 'analysis_cost', type: 'number' },
      { name: 'transcription_time', type: 'text' },
      { name: 'combined_text', type: 'text' },
      { name: 'image_urls', type: 'json' },
    ],
  });
  console.log('✅ Created notes collection\n');

  // Create templates collection
  console.log('📦 Creating templates collection...');
  const templates = await pb.collections.create({
    name: 'templates',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    fields: [
      { name: 'user', type: 'relation', options: { collectionId: usersCollection.id, maxSelect: 1 } },
      { name: 'chief_complaint', type: 'text' },
      { name: 'soap_subjective', type: 'text' },
      { name: 'soap_objective', type: 'text' },
      { name: 'soap_assessment', type: 'text' },
      { name: 'soap_plan', type: 'text' },
      { name: 'patient_instructions', type: 'text' },
    ],
  });
  console.log('✅ Created templates collection\n');

  // Create user_settings collection
  console.log('📦 Creating user_settings collection...');
  const settings = await pb.collections.create({
    name: 'user_settings',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    fields: [
      { name: 'user', type: 'relation', required: true, options: { collectionId: usersCollection.id, maxSelect: 1 } },
      { name: 'appointment_types', type: 'json' },
      { name: 'appointment_types_default', type: 'text' },
      { name: 'appointment_specialties', type: 'json' },
      { name: 'appointment_specialties_default', type: 'text' },
    ],
  });
  console.log('✅ Created user_settings collection\n');

  console.log('✨ All done! Collections created with fields.\n');
  console.log('Try accessing: http://localhost:3000/dashboard/notes\n');
}

createCollections().catch(error => {
  console.error('❌ Error:', error.message);
  console.error(error);
  process.exit(1);
});
