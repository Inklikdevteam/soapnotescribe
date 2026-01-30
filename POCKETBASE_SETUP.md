# PocketBase Setup Guide

## Quick Start (Automated)

### Option 1: PowerShell Script (Windows - Easiest)

```powershell
npm run setup:pb
```

This will:
- Download PocketBase
- Extract it to your project root
- Start PocketBase server
- Show you next steps

### Option 2: Manual Setup

#### Step 1: Download PocketBase

**Windows:**
```powershell
# Download
Invoke-WebRequest -Uri "https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_windows_amd64.zip" -OutFile "pocketbase.zip"

# Extract
Expand-Archive -Path pocketbase.zip -DestinationPath . -Force

# Clean up
Remove-Item pocketbase.zip
```

#### Step 2: Start PocketBase

```bash
# Windows
./pocketbase serve

# Or use npm script
npm run pocketbase
```

PocketBase will start at: **http://127.0.0.1:8090**

#### Step 3: Create Admin Account

1. Open http://127.0.0.1:8090/_/
2. Create your admin email and password
3. You'll be logged into the admin dashboard

#### Step 4: Import Schema

**Method A - Manual Import (Recommended):**

1. In PocketBase Admin UI, go to **Settings** → **Import collections**
2. Open `pb_schema.json` in a text editor
3. Copy all contents
4. Paste into the import dialog
5. Click **Import**

**Method B - Automated Import:**

```powershell
# Set your admin credentials
$env:POCKETBASE_ADMIN_EMAIL="your-admin@email.com"
$env:POCKETBASE_ADMIN_PASSWORD="your-password"

# Run import script
npm run import:schema
```

#### Step 5: Start Your App

```bash
npm run dev
```

Your app will be at: **http://localhost:3000**

## Verify Setup

After importing the schema, you should see these collections in PocketBase Admin:

- ✅ **users** (built-in)
- ✅ **patients**
- ✅ **notes**
- ✅ **templates**
- ✅ **user_settings**
- ✅ **waitlist**

## Test Authentication

1. Go to http://localhost:3000/signup
2. Create a new user account
3. Try logging in
4. Verify you can access the dashboard

## Troubleshooting

### PocketBase won't start

**Error:** "Port 8090 already in use"

```powershell
# Find and kill the process
Get-Process -Name "pocketbase" | Stop-Process -Force
```

### Schema import fails

**Solution:** Import manually via Admin UI (Method A above)

### "Cannot connect to PocketBase"

1. Make sure PocketBase is running: `./pocketbase serve`
2. Check the URL in `.env.local`: `NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090`
3. Verify PocketBase is accessible: Open http://127.0.0.1:8090/_/

### Authentication not working

1. Clear browser cookies
2. Check that `pb_auth` cookie is being set
3. Verify middleware is running (check browser DevTools → Network)

## Environment Variables

Your `.env.local` should have:

```env
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

For automated schema import (optional):

```env
POCKETBASE_ADMIN_EMAIL=your-admin@email.com
POCKETBASE_ADMIN_PASSWORD=your-password
```

## Development Workflow

### Running Both Servers

**Terminal 1 - PocketBase:**
```bash
npm run pocketbase
```

**Terminal 2 - Next.js:**
```bash
npm run dev
```

### Accessing Admin UI

PocketBase Admin: http://127.0.0.1:8090/_/

Here you can:
- View/edit collections
- Manage users
- View logs
- Backup/restore data
- Update collection rules

## Data Backup

PocketBase stores all data in the `pb_data` folder. To backup:

```powershell
# Stop PocketBase first
Get-Process -Name "pocketbase" | Stop-Process -Force

# Copy the data folder
Copy-Item -Path "pb_data" -Destination "pb_data_backup_$(Get-Date -Format 'yyyy-MM-dd')" -Recurse
```

## Production Deployment

For production, you'll need to:

1. Deploy PocketBase to a server (VPS, cloud, etc.)
2. Update `NEXT_PUBLIC_POCKETBASE_URL` to your production URL
3. Set up HTTPS for PocketBase
4. Configure proper backup strategy

See: https://pocketbase.io/docs/going-to-production/

## Useful Commands

```bash
# Start PocketBase
npm run pocketbase

# Import schema (after setting admin credentials)
npm run import:schema

# Setup everything (Windows)
npm run setup:pb

# Start Next.js dev server
npm run dev
```

## Next Steps

After setup is complete:

1. ✅ Test user signup/login
2. ✅ Create a patient
3. ✅ Create a note
4. ⏳ Update file upload components (see MIGRATION_STATUS.md)
5. ⏳ Test audio uploads
6. ⏳ Test PDF generation

## Resources

- **PocketBase Docs:** https://pocketbase.io/docs/
- **API Reference:** See `POCKETBASE_API_GUIDE.md`
- **Migration Status:** See `MIGRATION_STATUS.md`
- **Schema File:** `pb_schema.json`
