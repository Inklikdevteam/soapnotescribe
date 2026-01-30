/**
 * Create Collections via Direct API Call
 */

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

async function createCollections() {
  console.log('🚀 Creating Collections via API\n');

  // Authenticate
  const authResponse = await fetch(`${POCKETBASE_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: adminEmail, password: adminPassword }),
  });
  const authData = await authResponse.json();
  const token = authData.token;
  console.log('✅ Authenticated\n');

  // Get collections to find IDs
  const collectionsResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
    headers: { 'Authorization': token },
  });
  const collectionsData = await collectionsResponse.json();
  // PocketBase returns { items: [...] } or just an array depending on version
  const collections = Array.isArray(collectionsData) ? collectionsData : (collectionsData.items || []);
  
  const usersId = collections.find(c => c.name === 'users')?.id;
  
  console.log('Users ID:', usersId);
  console.log('');

  // Delete existing collections
  console.log('🗑️  Cleaning up...');
  for (const name of ['notes', 'templates', 'user_settings', 'patients']) {
    const col = collections.find(c => c.name === name);
    if (col) {
      await fetch(`${POCKETBASE_URL}/api/collections/${col.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token },
      });
      console.log(`   Deleted ${name}`);
    }
  }
  console.log('');

  // Create patients collection first (notes depends on it)
  console.log('📦 Creating patients collection...');
  const patientsPayload = {
    name: 'patients',
    type: 'base',
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    fields: [
      { name: 'first_name', type: 'text', required: false },
      { name: 'middle_name', type: 'text', required: false },
      { name: 'last_name', type: 'text', required: false },
      { name: 'date_of_birth', type: 'date', required: false },
      { name: 'sex', type: 'text', required: false },
      { name: 'gender', type: 'text', required: false },
      { name: 'email', type: 'email', required: false },
      { name: 'phone', type: 'text', required: false },
      { name: 'address_street', type: 'text', required: false },
      { name: 'address_unit', type: 'text', required: false },
      { name: 'city', type: 'text', required: false },
      { name: 'state', type: 'text', required: false },
      { name: 'zipcode', type: 'text', required: false },
      { name: 'country', type: 'text', required: false },
      { name: 'allergies', type: 'text', required: false },
      { name: 'pharmacy_name', type: 'text', required: false },
      { name: 'pharmacy_phone', type: 'text', required: false },
      { name: 'profile_notes', type: 'text', required: false },
      { name: 'provider', type: 'text', required: false },
      { name: 'referral_source', type: 'text', required: false },
    ],
  };

  const patientsResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientsPayload),
  });
  
  let patientsId = null;
  if (patientsResponse.ok) {
    const patientsData = await patientsResponse.json();
    patientsId = patientsData.id;
    console.log('✅ Created patients (ID:', patientsId, ')\n');
  } else {
    const error = await patientsResponse.json();
    console.error('❌ Failed:', JSON.stringify(error, null, 2), '\n');
  }

  // Create notes collection
  console.log('📦 Creating notes collection...');
  const notesPayload = {
    name: 'notes',
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
        collectionId: usersId,
        cascadeDelete: false,
        maxSelect: 1
      },
      {
        name: 'patient',
        type: 'relation',
        required: false,
        collectionId: patientsId,
        cascadeDelete: false,
        maxSelect: 1
      },
      { name: 'chief_complaint', type: 'text', required: false },
      { name: 'appointment_date', type: 'date', required: false },
      { name: 'appointment_time', type: 'text', required: false },
      { name: 'appointment_type', type: 'text', required: false },
      { name: 'appointment_specialty', type: 'text', required: false },
      { name: 'status', type: 'text', required: false },
      { name: 'soap_subjective', type: 'text', required: false },
      { name: 'soap_objective', type: 'text', required: false },
      { name: 'soap_assessment', type: 'text', required: false },
      { name: 'soap_plan', type: 'text', required: false },
      { name: 'audio_transcript', type: 'text', required: false },
      { name: 'audio_storage_url', type: 'text', required: false },
      { name: 'pdf_storage_url', type: 'text', required: false },
      { name: 'allergies', type: 'text', required: false },
      { name: 'patient_instructions', type: 'text', required: false },
      { name: 'differential_diagnosis', type: 'text', required: false },
      { name: 'discharge_instructions', type: 'text', required: false },
      { name: 'appointment_summary', type: 'text', required: false },
      { name: 'feedback', type: 'text', required: false },
      { 
        name: 'audio_file', 
        type: 'file', 
        required: false,
        maxSelect: 1,
        maxSize: 52428800, // 50MB
        mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/mp4', 'audio/amr', 'audio/x-m4a']
      },
    ],
  };

  const notesResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notesPayload),
  });
  
  if (notesResponse.ok) {
    console.log('✅ Created notes\n');
  } else {
    const error = await notesResponse.json();
    console.error('❌ Failed:', JSON.stringify(error, null, 2), '\n');
  }

  // Create templates collection
  console.log('📦 Creating templates collection...');
  const templatesPayload = {
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
        collectionId: usersId,
        cascadeDelete: false,
        maxSelect: 1
      },
      { name: 'chief_complaint', type: 'text', required: false },
      { name: 'soap_subjective', type: 'text', required: false },
      { name: 'soap_objective', type: 'text', required: false },
      { name: 'soap_assessment', type: 'text', required: false },
      { name: 'soap_plan', type: 'text', required: false },
      { name: 'patient_instructions', type: 'text', required: false },
    ],
  };

  const templatesResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(templatesPayload),
  });
  
  if (templatesResponse.ok) {
    console.log('✅ Created templates\n');
  } else {
    const error = await templatesResponse.json();
    console.error('❌ Failed:', JSON.stringify(error, null, 2), '\n');
  }

  // Create user_settings collection
  console.log('📦 Creating user_settings collection...');
  const settingsPayload = {
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
        collectionId: usersId,
        cascadeDelete: false,
        maxSelect: 1
      },
      { name: 'appointment_types', type: 'json', required: false },
      { name: 'appointment_types_default', type: 'text', required: false },
      { name: 'appointment_specialties', type: 'json', required: false },
      { name: 'appointment_specialties_default', type: 'text', required: false },
      { name: 'theme', type: 'text', required: false },
    ],
  };

  const settingsResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settingsPayload),
  });
  
  if (settingsResponse.ok) {
    console.log('✅ Created user_settings\n');
  } else {
    const error = await settingsResponse.json();
    console.error('❌ Failed:', JSON.stringify(error, null, 2), '\n');
  }

  console.log('✨ Done!\n');
}

createCollections().catch(console.error);
