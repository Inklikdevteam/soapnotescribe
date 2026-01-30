# PocketBase Setup Instructions

## Quick Start

### 1. Install PocketBase

**Windows:**
```powershell
# Download PocketBase
Invoke-WebRequest -Uri "https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_windows_amd64.zip" -OutFile "pocketbase.zip"

# Extract
Expand-Archive -Path pocketbase.zip -DestinationPath . -Force

# Clean up
Remove-Item pocketbase.zip
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start PocketBase

```bash
# Start PocketBase (first terminal)
./pocketbase serve

# Or use npm script
npm run pocketbase
```

PocketBase will start on: http://127.0.0.1:8090

### 4. Create Admin Account

1. Open http://127.0.0.1:8090/_/
2. Create your admin email and password
3. You'll be logged into the admin dashboard

### 5. Import Schema

I'll create a schema import file for you. In the PocketBase admin:

1. Go to Settings > Import collections
2. Upload the `pb_schema.json` file (creating next)
3. Click Import

### 6. Start Your App

```bash
# Start Next.js (second terminal)
npm run dev
```

Your app will be on: http://localhost:3000

## What Changed

✅ Removed Supabase dependencies
✅ Added PocketBase client
✅ Updated middleware for PocketBase auth
✅ Created PocketBase utility files
✅ Updated environment variables

## Next Steps

You'll need to update your data fetching code to use PocketBase API instead of Supabase.

Key differences:
- `supabase.from('table').select()` → `pb.collection('table').getList()`
- `supabase.auth.signIn()` → `pb.collection('users').authWithPassword()`
- File uploads use PocketBase's built-in file handling

Would you like me to update specific files to use PocketBase?
