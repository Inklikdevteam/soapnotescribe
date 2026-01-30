# PocketBase Migration Status

## ✅ Completed

### Core Setup
- ✅ Installed PocketBase npm package
- ✅ Created PocketBase client utilities (`utils/pocketbase/`)
  - `client.ts` - Browser client
  - `server.ts` - Server client
  - `middleware.ts` - Auth middleware
- ✅ Updated middleware.ts to use PocketBase
- ✅ Updated .env.local with PocketBase URL
- ✅ Updated .gitignore for PocketBase files
- ✅ Created schema file (`pb_schema.json`)
- ✅ Removed Supabase dependencies from package.json

### Authentication
- ✅ `app/login/action.ts` - Login with PocketBase
- ✅ `app/signup/action.ts` - Signup with PocketBase
- ✅ `app/auth/signout/route.ts` - Logout
- ✅ `app/auth/confirm/route.ts` - Email confirmation

### Data Layer
- ✅ `app/lib/data.ts` - All data fetching functions migrated
  - Notes CRUD
  - Patients CRUD
  - Templates CRUD
  - User settings
  - User session

### UI Components
- ✅ `app/ui/Header.tsx` - Updated import

### Other
- ✅ `app/waitlist/action.ts` - Waitlist form

## 🔄 Still Need to Update

### File Uploads (Priority)
- ⏳ `app/components/AudioUpload.tsx` - Audio file uploads
- ⏳ `app/components/AudioUploadRecordVolumeVis.tsx` - Audio recording
- ⏳ `utils/generatePdf.ts` - PDF generation and storage

### Server Actions
- ⏳ `app/lib/actions.ts` - Various server actions
- ⏳ `app/dashboard/newnote/action.tsx` - Create note action
- ⏳ `app/dashboard/notes/[id]/edit/action.tsx` - Edit note action
- ⏳ `app/dashboard/templates/add/action.tsx` - Add template
- ⏳ `app/dashboard/templates/[id]/action.tsx` - Edit template
- ⏳ `app/dashboard/patients/[id]/edit/action.tsx` - Edit patient

### Dashboard Components
- ⏳ `app/ui/dashboard/LogOut.tsx` - Logout button
- ⏳ Various dashboard pages that fetch data

### API Routes
- ⏳ `app/api/replicate-webhook/route.js` - Webhook handler

## 📋 Next Steps

1. **Import Schema to PocketBase**
   - Open http://127.0.0.1:8090/_/
   - Go to Settings → Import collections
   - Upload `pb_schema.json`

2. **Test Authentication**
   - Try signing up a new user
   - Try logging in
   - Verify cookies are set

3. **Update File Upload Components**
   - AudioUpload.tsx needs major changes
   - Files in PocketBase are stored as record fields
   - No separate storage bucket

4. **Update Remaining Actions**
   - Go through each action file
   - Replace Supabase calls with PocketBase

5. **Test Each Feature**
   - Create/edit/delete notes
   - Create/edit patients
   - Upload audio files
   - Generate PDFs

## 🔑 Key Differences

### File Storage
**Supabase:**
```typescript
await supabase.storage.from('bucket').upload(path, file)
```

**PocketBase:**
```typescript
const formData = new FormData()
formData.append('audio_file', file)
await pb.collection('notes').create(formData)
```

### Getting File URLs
**Supabase:**
```typescript
const { data } = await supabase.storage.from('bucket').createSignedUrl(path, 600)
```

**PocketBase:**
```typescript
const url = pb.files.getUrl(record, record.audio_file)
```

### Relations
**Supabase:**
```typescript
.select('*, patient(*)')
```

**PocketBase:**
```typescript
.getOne(id, { expand: 'patient' })
// Access: record.expand.patient
```

## 🐛 Known Issues

1. File upload logic needs complete rewrite
2. PDF generation needs to use PocketBase file storage
3. Audio transcription webhook may need updates
4. Real-time features (if any) need to use PocketBase subscriptions

## 📚 Resources

- PocketBase Docs: https://pocketbase.io/docs/
- API Guide: See `POCKETBASE_API_GUIDE.md`
- Schema: See `pb_schema.json`
