# ✅ PocketBase Setup Checklist

Use this checklist to track your setup progress.

## 📋 Initial Setup

- [ ] **Run quick start**
  ```bash
  npm run quickstart
  ```

- [ ] **Create admin account**
  - Open http://127.0.0.1:8090/_/
  - Enter admin email and password
  - Click "Create"

- [ ] **Import database schema**
  - Method A (Manual):
    - [ ] Go to Settings → Import collections
    - [ ] Open `pb_schema.json` in text editor
    - [ ] Copy all contents
    - [ ] Paste into import dialog
    - [ ] Click "Import"
  
  - Method B (Automated):
    - [ ] Set environment variables:
      ```powershell
      $env:POCKETBASE_ADMIN_EMAIL="your-admin@email.com"
      $env:POCKETBASE_ADMIN_PASSWORD="your-password"
      ```
    - [ ] Run: `npm run import:schema`

- [ ] **Verify collections created**
  - [ ] users (built-in)
  - [ ] patients
  - [ ] notes
  - [ ] templates
  - [ ] user_settings
  - [ ] waitlist

- [ ] **Start Next.js app**
  ```bash
  npm run dev
  ```

## 🧪 Testing

### Authentication
- [ ] Sign up a new user
- [ ] Log in with the user
- [ ] Verify dashboard loads
- [ ] Log out
- [ ] Log back in

### Patients
- [ ] Create a new patient
- [ ] View patient list
- [ ] View patient details
- [ ] Edit patient information
- [ ] Search for patients

### Notes (Basic - without audio)
- [ ] Create a new note
- [ ] View notes list
- [ ] View note details
- [ ] Edit note
- [ ] Delete note

### Templates
- [ ] Create a template
- [ ] View templates list
- [ ] Edit template
- [ ] Delete template

### User Settings
- [ ] Access settings page
- [ ] Update settings
- [ ] Verify settings persist

## 🔄 Still TODO (Known Issues)

### High Priority
- [ ] **Audio Upload Component**
  - File: `app/components/AudioUpload.tsx`
  - Needs: Complete rewrite for PocketBase file handling

- [ ] **Audio Recording Component**
  - File: `app/components/AudioUploadRecordVolumeVis.tsx`
  - Needs: Update file upload logic

- [ ] **PDF Generation**
  - File: `utils/generatePdf.ts`
  - Needs: Update to use PocketBase file storage

### Medium Priority
- [ ] **Create Note Action**
  - File: `app/dashboard/newnote/action.tsx`
  - Needs: Update to use PocketBase

- [ ] **Edit Note Action**
  - File: `app/dashboard/notes/[id]/edit/action.tsx`
  - Needs: Update to use PocketBase

- [ ] **Template Actions**
  - File: `app/dashboard/templates/add/action.tsx`
  - File: `app/dashboard/templates/[id]/action.tsx`
  - Needs: Update to use PocketBase

- [ ] **Patient Edit Action**
  - File: `app/dashboard/patients/[id]/edit/action.tsx`
  - Needs: Update to use PocketBase

### Low Priority
- [ ] **Webhook Handler**
  - File: `app/api/replicate-webhook/route.js`
  - Needs: Review and update if needed

- [ ] **Dashboard Components**
  - Review all dashboard pages for Supabase references
  - Update as needed

## 📝 Environment Variables

- [ ] `.env.local` exists
- [ ] Contains: `NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090`
- [ ] (Optional) Contains admin credentials for automated import

## 🔧 Development Workflow

- [ ] Know how to start PocketBase: `npm run pocketbase`
- [ ] Know how to start Next.js: `npm run dev`
- [ ] Know how to access admin UI: http://127.0.0.1:8090/_/
- [ ] Know how to backup data: Copy `pb_data` folder

## 📚 Documentation Review

- [ ] Read `QUICKSTART.md`
- [ ] Skim `POCKETBASE_SETUP.md`
- [ ] Bookmark `POCKETBASE_API_GUIDE.md` for reference
- [ ] Review `MIGRATION_STATUS.md` for what's left
- [ ] Check `COMMANDS.md` for available commands

## 🎯 Next Steps

After completing this checklist:

1. **If everything works:**
   - Start working on file upload components
   - See `MIGRATION_STATUS.md` for what needs updating

2. **If something doesn't work:**
   - Check `POCKETBASE_SETUP.md` troubleshooting section
   - Verify PocketBase is running
   - Check browser console for errors
   - Verify collections were imported correctly

3. **Ready for production:**
   - See `README_POCKETBASE.md` production deployment section
   - Set up proper backups
   - Configure HTTPS
   - Update environment variables

## ✨ Completion

When you can check all items in the "Testing" section, your basic migration is complete!

The remaining items in "Still TODO" are for full feature parity with the original Supabase implementation.

---

**Current Status:** [ ] Setup Complete | [ ] Testing Complete | [ ] Ready for Development

**Date Completed:** _______________

**Notes:**
```
[Add any notes about issues encountered or customizations made]
```
