# 📝 Available Commands

## Quick Start

```bash
# One command setup - Downloads, installs, and starts PocketBase
npm run quickstart
```

## PocketBase Commands

```bash
# Start PocketBase server
npm run pocketbase

# Setup PocketBase (download and start)
npm run setup:pb

# Import database schema (requires admin credentials)
npm run import:schema
```

## Next.js Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Typical Workflow

### First Time Setup

```bash
# 1. Quick start (downloads and starts PocketBase)
npm run quickstart

# 2. Create admin account in browser (opens automatically)
#    http://127.0.0.1:8090/_/

# 3. Import schema (manual or automated)
#    Manual: Copy/paste pb_schema.json in Admin UI
#    Automated: Set env vars and run:
npm run import:schema

# 4. Start your app
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

## Environment Variables

### Required

```env
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

### Optional (for automated schema import)

```env
POCKETBASE_ADMIN_EMAIL=your-admin@email.com
POCKETBASE_ADMIN_PASSWORD=your-password
```

## Useful URLs

- **Next.js App:** http://localhost:3000
- **PocketBase Admin:** http://127.0.0.1:8090/_/
- **PocketBase API:** http://127.0.0.1:8090/api/

## PowerShell Helpers

```powershell
# Stop PocketBase
Get-Process -Name "pocketbase" | Stop-Process -Force

# Check if PocketBase is running
Get-Process -Name "pocketbase"

# Set admin credentials for schema import
$env:POCKETBASE_ADMIN_EMAIL="your-admin@email.com"
$env:POCKETBASE_ADMIN_PASSWORD="your-password"
```

## Backup Commands

```powershell
# Backup PocketBase data
Copy-Item -Path "pb_data" -Destination "pb_data_backup_$(Get-Date -Format 'yyyy-MM-dd')" -Recurse

# Restore from backup
Copy-Item -Path "pb_data_backup_2024-01-30" -Destination "pb_data" -Recurse -Force
```

## Troubleshooting Commands

```powershell
# Kill PocketBase if stuck
Get-Process -Name "pocketbase" | Stop-Process -Force

# Clear Next.js cache
Remove-Item -Path ".next" -Recurse -Force

# Reinstall dependencies
Remove-Item -Path "node_modules" -Recurse -Force
npm install

# Check PocketBase health
Invoke-WebRequest -Uri "http://127.0.0.1:8090/api/health"
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run quickstart` | Complete setup in one command |
| `npm run pocketbase` | Start PocketBase server |
| `npm run dev` | Start Next.js dev server |
| `npm run import:schema` | Import database schema |
| `npm run setup:pb` | Download and setup PocketBase |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

---

💡 **Tip:** Keep `npm run pocketbase` running in one terminal and `npm run dev` in another for the best development experience.
