/**
 * PocketBase Schema Setup Script
 * 
 * This script automatically creates all collections in PocketBase
 * Run with: node scripts/setup-pocketbase.js
 */

const PocketBase = require('pocketbase');

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

async function setupCollections() {
  const pb = new PocketBase(POCKETBASE_URL);

  console.log('🚀 Starting PocketBase schema setup...\n');

  try {
    // Check if PocketBase is running
    await pb.health.check();
    console.log('✅ PocketBase is running at', POCKETBASE_URL);
  } catch (error) {
    console.error('❌ Cannot connect to PocketBase. Make sure it\'s running at', POCKETBASE_URL);
    console.error('   Run: ./pocketbase serve');
    process.exit(1);
  }

  // Note: To create collections programmatically, you need admin authentication
  // This requires the admin email and password
  console.log('\n⚠️  Admin authentication required to create collections');
  console.log('Please create an admin account first by visiting:');
  console.log(`   ${POCKETBASE_URL}/_/\n`);
  console.log('Then set these environment variables:');
  console.log('   POCKETBASE_ADMIN_EMAIL=your-admin@email.com');
  console.log('   POCKETBASE_ADMIN_PASSWORD=your-password\n');

  const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
  const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('💡 Alternative: Import schema manually via Admin UI:');
    console.log(`   1. Go to ${POCKETBASE_URL}/_/`);
    console.log('   2. Settings → Import collections');
    console.log('   3. Upload pb_schema.json\n');
    process.exit(0);
  }

  try {
    // Authenticate as admin
    await pb.admins.authWithPassword(adminEmail, adminPassword);
    console.log('✅ Admin authenticated\n');
  } catch (error) {
    console.error('❌ Admin authentication failed:', error.message);
    process.exit(1);
  }

  // Define collections
  const collections = [
    {
      name: 'patients',
      type: 'base',
      schema: [
        { name: 'first_name', type: 'text', required: false },
        { name: 'middle_name', type: 'text', required: false },
        { name: 'last_name', type: 'text', required: false },
        { name: 'email', type: 'email', required: false },
        { name: 'phone', type: 'text', required: false },
        { name: 'date_of_birth', type: 'date', required: false },
        { name: 'gender', type: 'text', required: false },
        { name: 'sex', type: 'text', required: false },
        { name: 'address_street', type: 'text', required: false },
        { name: 'address_unit', type: 'text', required: false },
        { name: 'city', type: 'text', required: false },
        { name: 'state', type: 'text', required: false },
        { name: 'country', type: 'text', required: false },
        { name: 'zipcode', type: 'text', required: false },
        { name: 'allergies', type: 'text', required: false },
        { name: 'pharmacy_name', type: 'text', required: false },
        { name: 'pharmacy_phone', type: 'text', required: false },
        { name: 'profile_notes', type: 'text', required: false },
        { name: 'provider', type: 'text', required: false },
        { name: 'referral_source', type: 'text', required: false },
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
        { name: 'user', type: 'relation', required: true, options: { collectionId: '_pb_users_auth_', cascadeDelete: false, maxSelect: 1 } },
        { name: 'patient', type: 'relation', required: false, options: { collectionId: 'patients', cascadeDelete: false, maxSelect: 1 } },
        { name: 'chief_complaint', type: 'text', required: false },
        { name: 'appointment_date', type: 'date', required: false },
        { name: 'appointment_time', type: 'text', required: true },
        { name: 'appointment_type', type: 'text', required: false },
        { name: 'appointment_specialty', type: 'text', required: false },
        { name: 'appointment_summary', type: 'text', required: false },
        { name: 'audio_transcript', type: 'text', required: false },
        { name: 'audio_file', type: 'file', required: false, options: { maxSelect: 1, maxSize: 104857600 } },
        { name: 'pdf_file', type: 'file', required: false, options: { maxSelect: 1, maxSize: 10485760 } },
        { name: 'soap_subjective', type: 'text', required: false },
        { name: 'soap_objective', type: 'text', required: false },
        { name: 'soap_assessment', type: 'text', required: false },
        { name: 'soap_plan', type: 'text', required: false },
        { name: 'patient_instructions', type: 'text', required: false },
        { name: 'differential_diagnosis', type: 'text', required: false },
        { name: 'discharge_instructions', type: 'text', required: false },
        { name: 'allergies', type: 'text', required: false },
        { name: 'patient_age_years', type: 'number', required: false },
        { name: 'patient_location', type: 'text', required: false },
        { name: 'status', type: 'text', required: false },
        { name: 'consent', type: 'bool', required: false },
        { name: 'doctor_signature', type: 'text', required: false },
        { name: 'feedback', type: 'text', required: false },
        { name: 'transcription_cost', type: 'number', required: false },
        { name: 'analysis_cost', type: 'number', required: false },
        { name: 'transcription_time', type: 'text', required: false },
        { name: 'combined_text', type: 'text', required: false },
        { name: 'image_urls', type: 'json', required: false },
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
        { name: 'user', type: 'relation', required: false, options: { collectionId: '_pb_users_auth_', cascadeDelete: false, maxSelect: 1 } },
        { name: 'chief_complaint', type: 'text', required: false },
        { name: 'soap_subjective', type: 'text', required: false },
        { name: 'soap_objective', type: 'text', required: false },
        { name: 'soap_assessment', type: 'text', required: false },
        { name: 'soap_plan', type: 'text', required: false },
        { name: 'patient_instructions', type: 'text', required: false },
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
        { name: 'user', type: 'relation', required: true, options: { collectionId: '_pb_users_auth_', cascadeDelete: true, maxSelect: 1 } },
        { name: 'appointment_types', type: 'json', required: false },
        { name: 'appointment_types_default', type: 'text', required: false },
        { name: 'appointment_specialties', type: 'json', required: false },
        { name: 'appointment_specialties_default', type: 'text', required: false },
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
        { name: 'email', type: 'email', required: false },
        { name: 'note', type: 'text', required: false },
      ],
      listRule: null,
      viewRule: null,
      createRule: '',
      updateRule: null,
      deleteRule: null,
    },
  ];

  // Create collections
  for (const collectionData of collections) {
    try {
      console.log(`📦 Creating collection: ${collectionData.name}...`);
      
      // Check if collection already exists
      try {
        await pb.collections.getOne(collectionData.name);
        console.log(`   ⚠️  Collection '${collectionData.name}' already exists, skipping`);
        continue;
      } catch (error) {
        // Collection doesn't exist, create it
      }

      await pb.collections.create(collectionData);
      console.log(`   ✅ Created '${collectionData.name}'`);
    } catch (error) {
      console.error(`   ❌ Failed to create '${collectionData.name}':`, error.message);
    }
  }

  console.log('\n✨ Schema setup complete!\n');
  console.log('Next steps:');
  console.log('1. Start your Next.js app: npm run dev');
  console.log('2. Try signing up a new user');
  console.log('3. Test the application\n');
}

// Run the setup
setupCollections().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
