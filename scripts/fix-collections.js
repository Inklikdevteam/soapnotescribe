/**
 * Fix and create remaining collections
 */

const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

async function fixCollections() {
  console.log('🔧 Fixing PocketBase Collections\n');

  const pb = new PocketBase(POCKETBASE_URL);

  // Authenticate
  await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
  console.log('✅ Authenticated\n');

  // Get existing collections
  const allCollections = await pb.collections.getFullList();
  console.log('📋 Existing collections:');
  allCollections.forEach(c => console.log(`   - ${c.name} (${c.id})`));
  console.log('');

  // Find IDs
  const usersCollection = allCollections.find(c => c.name === 'users');
  const patientsCollection = allCollections.find(c => c.name === 'patients');

  if (!usersCollection) {
    console.log('❌ Users collection not found');
    return;
  }
  if (!patientsCollection) {
    console.log('❌ Patients collection not found');
    return;
  }

  console.log(`✅ Found users: ${usersCollection.id}`);
  console.log(`✅ Found patients: ${patientsCollection.id}\n`);

  // Create notes collection
  try {
    const notesExists = allCollections.find(c => c.name === 'notes');
    if (notesExists) {
      console.log('⚠️  notes collection already exists\n');
    } else {
      console.log('📦 Creating notes collection...');
      const notesCollection = await pb.collections.create({
        name: 'notes',
        type: 'base',
        schema: [
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
        // Create without rules first
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
      });
      console.log('✅ Created notes collection');
      
      // Now update with rules
      console.log('   Adding API rules...');
      await pb.collections.update(notesCollection.id, {
        listRule: '@request.auth.id != "" && user = @request.auth.id',
        viewRule: '@request.auth.id != "" && user = @request.auth.id',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != "" && user = @request.auth.id',
        deleteRule: '@request.auth.id != "" && user = @request.auth.id',
      });
      console.log('✅ Added API rules to notes\n');
    }
  } catch (error) {
    console.error('❌ Failed to create notes:', error.message, '\n');
  }

  // Create templates collection
  try {
    const templatesExists = allCollections.find(c => c.name === 'templates');
    if (templatesExists) {
      console.log('⚠️  templates collection already exists\n');
    } else {
      console.log('📦 Creating templates collection...');
      const templatesCollection = await pb.collections.create({
        name: 'templates',
        type: 'base',
        schema: [
          { name: 'user', type: 'relation', options: { collectionId: usersCollection.id, maxSelect: 1 } },
          { name: 'chief_complaint', type: 'text' },
          { name: 'soap_subjective', type: 'text' },
          { name: 'soap_objective', type: 'text' },
          { name: 'soap_assessment', type: 'text' },
          { name: 'soap_plan', type: 'text' },
          { name: 'patient_instructions', type: 'text' },
        ],
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
      });
      console.log('✅ Created templates collection');
      
      console.log('   Adding API rules...');
      await pb.collections.update(templatesCollection.id, {
        listRule: '@request.auth.id != "" && user = @request.auth.id',
        viewRule: '@request.auth.id != "" && user = @request.auth.id',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != "" && user = @request.auth.id',
        deleteRule: '@request.auth.id != "" && user = @request.auth.id',
      });
      console.log('✅ Added API rules to templates\n');
    }
  } catch (error) {
    console.error('❌ Failed to create templates:', error.message, '\n');
  }

  // Create user_settings collection
  try {
    const settingsExists = allCollections.find(c => c.name === 'user_settings');
    if (settingsExists) {
      console.log('⚠️  user_settings collection already exists\n');
    } else {
      console.log('📦 Creating user_settings collection...');
      const settingsCollection = await pb.collections.create({
        name: 'user_settings',
        type: 'base',
        schema: [
          { name: 'user', type: 'relation', required: true, options: { collectionId: usersCollection.id, maxSelect: 1 } },
          { name: 'appointment_types', type: 'json' },
          { name: 'appointment_types_default', type: 'text' },
          { name: 'appointment_specialties', type: 'json' },
          { name: 'appointment_specialties_default', type: 'text' },
        ],
        indexes: ['CREATE UNIQUE INDEX idx_user ON user_settings (user)'],
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
      });
      console.log('✅ Created user_settings collection');
      
      console.log('   Adding API rules...');
      await pb.collections.update(settingsCollection.id, {
        listRule: '@request.auth.id != "" && user = @request.auth.id',
        viewRule: '@request.auth.id != "" && user = @request.auth.id',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != "" && user = @request.auth.id',
        deleteRule: '@request.auth.id != "" && user = @request.auth.id',
      });
      console.log('✅ Added API rules to user_settings\n');
    }
  } catch (error) {
    console.error('❌ Failed to create user_settings:', error.message, '\n');
  }

  console.log('✨ All done!\n');
  console.log('Verify at: http://127.0.0.1:8090/_/\n');
}

fixCollections().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
