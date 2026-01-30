# 📖 Documentation Index

Complete guide to all PocketBase migration documentation.

---

## 🚀 Getting Started

Start here if this is your first time:

1. **[START_HERE.md](./START_HERE.md)** ⭐
   - Quick overview
   - 5-minute setup
   - Essential commands
   - What to read next

2. **[QUICKSTART.md](./QUICKSTART.md)**
   - One-command setup
   - Step-by-step instructions
   - Troubleshooting basics

3. **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)**
   - Interactive checklist
   - Track your progress
   - Testing guide

---

## 📚 Setup & Configuration

Detailed setup instructions:

- **[POCKETBASE_SETUP.md](./POCKETBASE_SETUP.md)**
  - Complete setup guide
  - Manual and automated methods
  - Environment variables
  - Backup strategies
  - Production deployment

- **[COMMANDS.md](./COMMANDS.md)**
  - All available npm scripts
  - PowerShell helpers
  - Backup commands
  - Troubleshooting commands
  - Quick reference table

---

## 🔧 Development

For developers working on the codebase:

- **[POCKETBASE_API_GUIDE.md](./POCKETBASE_API_GUIDE.md)**
  - Supabase → PocketBase API mapping
  - Code examples
  - Authentication patterns
  - CRUD operations
  - File handling
  - Real-time subscriptions

- **[MIGRATION_STATUS.md](./MIGRATION_STATUS.md)**
  - What's been migrated ✅
  - What still needs work ⏳
  - Known issues 🐛
  - Priority levels
  - File-by-file status

---

## 📋 Reference

Quick reference and summaries:

- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)**
  - Migration summary
  - What's been done
  - Key changes
  - Testing checklist
  - Next steps

- **[README_POCKETBASE.md](./README_POCKETBASE.md)**
  - Comprehensive guide
  - All topics in one place
  - Visual flow diagrams
  - Learning resources

---

## 🗂️ Technical Files

Schema and configuration:

- **[pb_schema.json](./pb_schema.json)**
  - Database schema definition
  - Collection structures
  - Field types
  - Access rules
  - Relations

- **[.env.local](./.env.local)**
  - Environment variables
  - PocketBase URL configuration

---

## 🛠️ Scripts

Automation scripts in `scripts/` folder:

- **[scripts/quick-start.ps1](./scripts/quick-start.ps1)**
  - One-command setup
  - Downloads PocketBase
  - Starts server
  - Opens admin UI

- **[scripts/setup-pocketbase.ps1](./scripts/setup-pocketbase.ps1)**
  - Download and extract PocketBase
  - Start server
  - Show instructions

- **[scripts/import-schema.js](./scripts/import-schema.js)**
  - Automated schema import
  - Requires admin credentials
  - Creates all collections

- **[scripts/setup-pocketbase.js](./scripts/setup-pocketbase.js)**
  - Node.js setup script
  - Alternative to PowerShell
  - Programmatic collection creation

---

## 📊 Documentation Map

```
┌─────────────────────────────────────────────────────────┐
│                    START_HERE.md                        │
│                  (Read this first!)                     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
  QUICKSTART.md  COMMANDS.md  SETUP_CHECKLIST.md
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
           POCKETBASE_SETUP.md
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
POCKETBASE_API  MIGRATION_   SETUP_COMPLETE
   _GUIDE.md     STATUS.md        .md
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
           README_POCKETBASE.md
           (Comprehensive guide)
```

---

## 🎯 Quick Navigation

### I want to...

**Get started quickly**
→ [START_HERE.md](./START_HERE.md) → [QUICKSTART.md](./QUICKSTART.md)

**See all commands**
→ [COMMANDS.md](./COMMANDS.md)

**Track my setup progress**
→ [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

**Learn the API differences**
→ [POCKETBASE_API_GUIDE.md](./POCKETBASE_API_GUIDE.md)

**See what's left to do**
→ [MIGRATION_STATUS.md](./MIGRATION_STATUS.md)

**Understand what changed**
→ [SETUP_COMPLETE.md](./SETUP_COMPLETE.md)

**Get comprehensive info**
→ [README_POCKETBASE.md](./README_POCKETBASE.md)

**Troubleshoot issues**
→ [POCKETBASE_SETUP.md](./POCKETBASE_SETUP.md) (Troubleshooting section)

**Deploy to production**
→ [README_POCKETBASE.md](./README_POCKETBASE.md) (Production section)

---

## 📝 Document Purposes

| Document | Purpose | Audience |
|----------|---------|----------|
| START_HERE.md | Entry point | Everyone |
| QUICKSTART.md | Fast setup | New users |
| SETUP_CHECKLIST.md | Track progress | Setup phase |
| COMMANDS.md | Command reference | Daily use |
| POCKETBASE_SETUP.md | Detailed setup | Setup phase |
| POCKETBASE_API_GUIDE.md | API reference | Developers |
| MIGRATION_STATUS.md | Progress tracking | Developers |
| SETUP_COMPLETE.md | Summary | Overview |
| README_POCKETBASE.md | Complete guide | Everyone |
| pb_schema.json | Database schema | Technical |

---

## 🔄 Recommended Reading Order

### First Time Setup
1. START_HERE.md
2. QUICKSTART.md
3. SETUP_CHECKLIST.md (use while setting up)
4. COMMANDS.md (bookmark for reference)

### Development
1. POCKETBASE_API_GUIDE.md (keep open while coding)
2. MIGRATION_STATUS.md (check what needs work)
3. COMMANDS.md (quick reference)

### Troubleshooting
1. POCKETBASE_SETUP.md (troubleshooting section)
2. COMMANDS.md (troubleshooting commands)
3. README_POCKETBASE.md (comprehensive info)

### Production
1. README_POCKETBASE.md (production section)
2. POCKETBASE_SETUP.md (backup strategies)
3. Official PocketBase docs

---

## 🌐 External Resources

- **PocketBase Official Docs:** https://pocketbase.io/docs/
- **PocketBase GitHub:** https://github.com/pocketbase/pocketbase
- **JavaScript SDK:** https://github.com/pocketbase/js-sdk
- **Community Discord:** https://discord.gg/pocketbase

---

## 📞 Getting Help

1. **Check documentation** (you're here!)
2. **Review troubleshooting** in POCKETBASE_SETUP.md
3. **Check PocketBase docs** at https://pocketbase.io/docs/
4. **Search GitHub issues** at https://github.com/pocketbase/pocketbase/issues

---

## ✨ Ready to Start?

Head over to **[START_HERE.md](./START_HERE.md)** to begin!

---

*Last updated: January 30, 2026*
