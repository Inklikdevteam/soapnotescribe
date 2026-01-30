# 🚀 Quick Start Guide

## One Command Setup

```bash
npm run quickstart
```

This will:
1. ✅ Download and install PocketBase
2. ✅ Start PocketBase server
3. ✅ Open admin UI in your browser
4. ✅ Show you next steps

## What You Need to Do

After running `npm run quickstart`:

### 1. Create Admin Account (1 minute)
- Browser will open to http://127.0.0.1:8090/_/
- Enter your admin email and password
- Click "Create"

### 2. Import Database Schema (1 minute)
- In PocketBase Admin, click **Settings** → **Import collections**
- Open `pb_schema.json` in a text editor
- Copy all contents
- Paste into the import dialog
- Click **Import**

### 3. Start Your App
```bash
npm run dev
```

### 4. Test It
- Go to http://localhost:3000
- Sign up a new user
- Start using the app!

## Alternative: Manual Setup

If you prefer step-by-step control, see [POCKETBASE_SETUP.md](./POCKETBASE_SETUP.md)

## Automated Schema Import

After creating your admin account, you can automate the schema import:

```powershell
# Set credentials
$env:POCKETBASE_ADMIN_EMAIL="your-admin@email.com"
$env:POCKETBASE_ADMIN_PASSWORD="your-password"

# Import schema
npm run import:schema
```

## Troubleshooting

**PocketBase won't start?**
```powershell
Get-Process -Name "pocketbase" | Stop-Process -Force
npm run pocketbase
```

**Schema import fails?**
- Use manual import method (copy/paste from pb_schema.json)

**Can't connect?**
- Make sure PocketBase is running: `npm run pocketbase`
- Check `.env.local` has: `NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090`

## Need Help?

- 📖 Full Setup Guide: [POCKETBASE_SETUP.md](./POCKETBASE_SETUP.md)
- 📚 API Reference: [POCKETBASE_API_GUIDE.md](./POCKETBASE_API_GUIDE.md)
- 📋 Migration Status: [MIGRATION_STATUS.md](./MIGRATION_STATUS.md)

## Running the App

**Terminal 1 - PocketBase:**
```bash
npm run pocketbase
```

**Terminal 2 - Next.js:**
```bash
npm run dev
```

**Access:**
- App: http://localhost:3000
- PocketBase Admin: http://127.0.0.1:8090/_/

---

✨ **That's it!** You're ready to go.
