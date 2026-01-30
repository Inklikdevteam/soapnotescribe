/**
 * Create PocketBase Collections Directly
 * This script creates collections one by one with better error handling
 */

const PocketBase = require('pocketbase').default;

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

async function createCollections() {
  console.log('🚀 Creating PocketBase Collections\n');

  if (!adminEmail || !adminPassword) {
    console.log('❌ Missing credentials. Please set:');
    console.log('   $env:POCKETBASE_ADMIN_EMAIL="your-email"');
    console.log('   $env:POCKETBASE_ADMIN_PASSWORD="your-password"\n');
    process.exit(1);
  }

  const pb = new PocketBase(POCKETBASE_URL);

  // Authenticate
  try {
    await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
    console.log('✅ Admin authenticated\n');
  } catch (error) {
    console.log('❌ Authentication failed:', error.message);
    console.log('\nMake sure you:');
    console.log('1. Created an admin account at http://127.0.0.1:8090/_/');
    console.log('2. Used the correct email and password\n');
    process.exit(1);
  }

  // Define collections
  const collections = [
    {
      name: 'patients',
      type: 'base',
      schema: [
        { name: 'first_name', type: 'text' },
        { name: 'middle_name', type: 'text' },
        { name: 'last_name', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'date_of_birth', type: 'date' },
        { name: 'gender', type: 'text' },
        { name: 'sex', type: 'text' },
        { name: 'address_street', type: 'text' },
        { name: 'address_unit', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'country', type: 'text' },
        { name: 'zipcode', type: 'text' },
        { name: 'allergies', type: 'text' },
        { name: 'pharmacy_name', type: 'text' },
        { name: 'pharmacy_phone', type: 'text' },
        { name: 'profile_notes', type: 'text' },
        { name: 'provider', type: 'text' },
        { name: 'referral_source', type: 'text' },
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    },
    {
      name: 'notes',
      type: 'base',
      schema: [
        { name: 'user', type: 'relation', options: { collectionId: '_pb_users_auth_', maxSelect: 1 } },
        { name: 'patient', type: 'relation', options: { collectionId: 'PATIENTS_ID', maxSelect: 1 } },
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
      listRule: '@request.auth.id != "" && user = @request.auth.id',
      viewRule: '@request.auth.id != "" && user = @request.auth.id',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != "" && user = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user = @request.auth.id',
    },
    {
      name: 'templates',
      type: 'base',
      schema: [
        { name: 'user', type: 'relation', options: { collectionId: '_pb_users_auth_', maxSelect: 1 } },
        { name: 'chief_complaint', type: 'text' },
        { name: 'soap_subjective', type: 'text' },
        { name: 'soap_objective', type: 'text' },
        { name: 'soap_assessment', type: 'text' },
        { name: 'soap_plan', type: 'text' },
        { name: 'patient_instructions', type: 'text' },
      ],
      listRule: '@request.auth.id != "" && user = @request.auth.id',
      viewRule: '@request.auth.id != "" && user = @request.auth.id',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != "" && user = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user = @request.auth.id',
    },
    {
      name: 'user_settings',
      type: 'base',
      schema: [
        { name: 'user', type: 'relation', required: true, options: { collectionId: '_pb_users_auth_', maxSelect: 1 } },
        { name: 'appointment_types', type: 'json' },
        { name: 'appointment_types_default', type: 'text' },
        { name: 'appointment_specialties', type: 'json' },
        { name: 'appointment_specialties_default', type: 'text' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_user ON user_settings (user)'],
      listRule: '@request.auth.id != "" && user = @request.auth.id',
      viewRule: '@request.auth.id != "" && user = @request.auth.id',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != "" && user = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user = @request.auth.id',
    },
    {
      name: 'waitlist',
      type: 'base',
      schema: [
        { name: 'email', type: 'email' },
        { name: 'note', type: 'text' },
      ],
      listRule: null,
      viewRule: null,
      createRule: '',
      updateRule: null,
      deleteRule: null,
    },
  ];

  let patientsId = null;

  // Create collections
  for (const collectionData of collections) {
    try {
      // Check if exists
      try {
        const existing = await pb.collections.getOne(collectionData.name);
        console.log(`⚠️  Collection '${collectionData.name}' already exists (ID: ${existing.id})`);
        if (collectionData.name === 'patients') {
          patientsId = existing.id;
        }
        continue;
      } catch (e) {
        // Doesn't exist, create it
      }

      // Replace PATIENTS_ID placeholder
      if (collectionData.name === 'notes' && patientsId) {
        collectionData.schema = collectionData.schema.map(field => {
          if (field.name === 'patient' && field.options) {
            field.options.collectionId = patientsId;
          }
          return field;
        });
      }

      console.log(`📦 Creating '${collectionData.name}'...`);
      const created = await pb.collections.create(collectionData);
      console.log(`✅ Created '${collectionData.name}' (ID: ${created.id})\n`);

      if (collectionData.name === 'patients') {
        patientsId = created.id;
      }
    } catch (error) {
      console.error(`❌ Failed to create '${collectionData.name}':`, error.message, '\n');
    }
  }

  console.log('✨ Done!\n');
  console.log('Next steps:');
  console.log('1. Verify collections at: http://127.0.0.1:8090/_/');
  console.log('2. Start your app: npm run dev\n');
}

createCollections().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
