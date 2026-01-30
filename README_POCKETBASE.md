# 🎯 PocketBase Migration - Complete Guide

## 🚀 Get Started in 5 Minutes

```bash
npm run quickstart
```

That's it! The script will guide you through the rest.

---

## 📖 What is This?

Your app has been migrated from **Supabase** to **PocketBase** - a self-hosted, open-source backend that gives you:

- ✅ **No vendor lock-in** - You own your data
- ✅ **Zero infrastructure** - Single binary, no Docker required
- ✅ **Built-in admin UI** - Manage everything visually
- ✅ **Real-time subscriptions** - Just like Supabase
- ✅ **File storage** - Built into records
- ✅ **Authentication** - Email/password + OAuth

---

## 📋 Setup Flow

```
┌─────────────────────────────────────────────────────────┐
│  1. Run: npm run quickstart                             │
│     ↓                                                    │
│  2. PocketBase downloads and starts automatically       │
│     ↓                                                    │
│  3. Browser opens to create admin account               │
│     ↓                                                    │
│  4. Import schema (copy/paste pb_schema.json)           │
│     ↓                                                    │
│  5. Run: npm run dev                                    │
│     ↓                                                    │
│  6. ✨ You're done!                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🎮 Quick Commands

| What You Want | Command |
|---------------|---------|
| **Complete setup** | `npm run quickstart` |
| **Start PocketBase** | `npm run pocketbase` |
| **Start Next.js** | `npm run dev` |
| **Import schema** | `npm run import:schema` |

---

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- **[POCKETBASE_SETUP.md](./POCKETBASE_SETUP.md)** - Detailed setup instructions
- **[POCKETBASE_API_GUIDE.md](./POCKETBASE_API_GUIDE.md)** - API migration reference
- **[MIGRATION_STATUS.md](./MIGRATION_STATUS.md)** - What's done, what's left
- **[COMMANDS.md](./COMMANDS.md)** - All available commands
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Migration summary

---

## 🔧 What's Been Migrated

### ✅ Completed
- Authentication (login, signup, logout)
- Database operations (CRUD for all tables)
- User sessions and cookies
- Middleware
- All data fetching functions

### ⏳ Still TODO
- File upload components (audio, PDF)
- Some server actions
- Webhook handlers

See [MIGRATION_STATUS.md](./MIGRATION_STATUS.md) for details.

---

## 🎯 Typical Development Workflow

### First Time

```bash
# 1. Setup everything
npm run quickstart

# 2. Follow on-screen instructions to:
#    - Create admin account
#    - Import schema

# 3. Start your app
npm run dev
```

### Daily Development

**Terminal 1:**
```bash
npm run pocketbase
```

**Terminal 2:**
```bash
npm run dev
```

**Access:**
- App: http://localhost:3000
- Admin: http://127.0.0.1:8090/_/

---

## 🆘 Troubleshooting

### PocketBase won't start

```powershell
# Kill existing process
Get-Process -Name "pocketbase" | Stop-Process -Force

# Start again
npm run pocketbase
```

### Schema import fails

Use manual import:
1. Go to http://127.0.0.1:8090/_/
2. Settings → Import collections
3. Copy contents of `pb_schema.json`
4. Paste and click Import

### Can't connect to PocketBase

1. Check PocketBase is running: `npm run pocketbase`
2. Verify `.env.local` has: `NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090`
3. Test health: http://127.0.0.1:8090/api/health

### Authentication not working

1. Clear browser cookies
2. Check DevTools → Application → Cookies for `pb_auth`
3. Restart both servers

---

## 🔑 Key Differences from Supabase

### File Storage

**Before (Supabase):**
```typescript
await supabase.storage.from('bucket').upload(path, file)
```

**After (PocketBase):**
```typescript
const formData = new FormData()
formData.append('audio_file', file)
await pb.collection('notes').create(formData)
```

### Getting File URLs

**Before:**
```typescript
const { data } = await supabase.storage
  .from('bucket')
  .createSignedUrl(path, 600)
```

**After:**
```typescript
const url = pb.files.getUrl(record, record.audio_file)
```

### Relations

**Before:**
```typescript
.select('*, patient(*)')
```

**After:**
```typescript
.getOne(id, { expand: 'patient' })
// Access: record.expand.patient
```

See [POCKETBASE_API_GUIDE.md](./POCKETBASE_API_GUIDE.md) for complete reference.

---

## 📦 Project Structure

```
your-project/
├── pb_data/                    # PocketBase database (auto-created)
├── pocketbase.exe              # PocketBase binary (auto-downloaded)
├── pb_schema.json              # Database schema
├── utils/pocketbase/           # PocketBase client utilities
│   ├── client.ts              # Browser client
│   ├── server.ts              # Server client
│   └── middleware.ts          # Auth middleware
├── scripts/                    # Setup automation scripts
│   ├── quick-start.ps1        # One-command setup
│   ├── setup-pocketbase.ps1   # Download and start
│   └── import-schema.js       # Automated schema import
└── [documentation files]
```

---

## 🎓 Learning Resources

- **PocketBase Docs:** https://pocketbase.io/docs/
- **PocketBase GitHub:** https://github.com/pocketbase/pocketbase
- **JavaScript SDK:** https://github.com/pocketbase/js-sdk

---

## 💾 Backup Your Data

PocketBase stores everything in `pb_data/`:

```powershell
# Backup
Copy-Item -Path "pb_data" -Destination "pb_data_backup" -Recurse

# Restore
Copy-Item -Path "pb_data_backup" -Destination "pb_data" -Recurse -Force
```

---

## 🚀 Production Deployment

For production:

1. Deploy PocketBase to a VPS/cloud server
2. Set up HTTPS (required for production)
3. Update `NEXT_PUBLIC_POCKETBASE_URL` to your production URL
4. Configure backups
5. Set up monitoring

See: https://pocketbase.io/docs/going-to-production/

---

## ✨ Ready to Start?

```bash
npm run quickstart
```

Follow the instructions and you'll be up and running in minutes!

---

**Need help?** Check the documentation files or visit https://pocketbase.io/docs/

**Found a bug?** See [MIGRATION_STATUS.md](./MIGRATION_STATUS.md) for known issues.
