/**
 * PocketBase Schema Import Script
 * 
 * This script imports the schema from pb_schema.json using PocketBase Admin API
 * Run with: node scripts/import-schema.js
 */

const fs = require('fs');
const path = require('path');

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

async function importSchema() {
  console.log('🚀 PocketBase Schema Import\n');

  // Read schema file
  const schemaPath = path.join(__dirname, '..', 'pb_schema.json');
  
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Schema file not found:', schemaPath);
    process.exit(1);
  }

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  console.log(`✅ Loaded schema with ${schema.length} collections\n`);

  // Check if PocketBase is running
  try {
    const response = await fetch(`${POCKETBASE_URL}/api/health`);
    if (!response.ok) throw new Error('Health check failed');
    console.log('✅ PocketBase is running at', POCKETBASE_URL, '\n');
  } catch (error) {
    console.error('❌ Cannot connect to PocketBase. Make sure it\'s running at', POCKETBASE_URL);
    console.error('   Run: ./pocketbase serve\n');
    process.exit(1);
  }

  // Get admin credentials
  const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
  const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('⚠️  Admin credentials not found in environment variables\n');
    console.log('To use this script, you need to:');
    console.log('1. Create an admin account at:', `${POCKETBASE_URL}/_/`);
    console.log('2. Set environment variables:');
    console.log('   POCKETBASE_ADMIN_EMAIL=your-admin@email.com');
    console.log('   POCKETBASE_ADMIN_PASSWORD=your-password\n');
    console.log('3. Run: node scripts/import-schema.js\n');
    console.log('💡 Alternative: Import manually via Admin UI:');
    console.log(`   1. Go to ${POCKETBASE_URL}/_/`);
    console.log('   2. Settings → Import collections');
    console.log('   3. Paste the contents of pb_schema.json\n');
    process.exit(0);
  }

  // Authenticate as admin
  let authToken;
  try {
    const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identity: adminEmail,
        password: adminPassword,
      }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    authToken = data.token;
    console.log('✅ Admin authenticated\n');
  } catch (error) {
    console.error('❌ Admin authentication failed:', error.message);
    console.error('   Check your POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD\n');
    process.exit(1);
  }

  // Create each collection
  for (const collection of schema) {
    try {
      console.log(`📦 Creating collection: ${collection.name}...`);

      // Check if collection exists
      const checkResponse = await fetch(
        `${POCKETBASE_URL}/api/collections/${collection.name}`,
        {
          headers: { 'Authorization': authToken },
        }
      );

      if (checkResponse.ok) {
        console.log(`   ⚠️  Collection '${collection.name}' already exists, skipping\n`);
        continue;
      }

      // Create collection
      const createResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },
        body: JSON.stringify(collection),
      });

      if (!createResponse.ok) {
        const error = await createResponse.text();
        throw new Error(error);
      }

      console.log(`   ✅ Created '${collection.name}'\n`);
    } catch (error) {
      console.error(`   ❌ Failed to create '${collection.name}':`, error.message, '\n');
    }
  }

  console.log('✨ Schema import complete!\n');
  console.log('Next steps:');
  console.log('1. Verify collections at:', `${POCKETBASE_URL}/_/`);
  console.log('2. Start your Next.js app: npm run dev');
  console.log('3. Try signing up a new user\n');
}

// Run the import
importSchema().catch(error => {
  console.error('❌ Import failed:', error);
  process.exit(1);
});
