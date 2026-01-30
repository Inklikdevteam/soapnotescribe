# Manual PocketBase Setup Guide

The automated scripts aren't creating collection fields properly. Follow these steps to manually set up the collections:

## Step 1: Delete Empty Collections

1. Go to http://127.0.0.1:8090/_/
2. Delete these collections (click the trash icon):
   - notes
   - templates  
   - user_settings

## Step 2: Create Notes Collection

1. Click "New collection"
2. Name: `notes`
3. Type: Base collection
4. Add these fields (click "+ New field" for each):

**Essential fields:**
- `user` - Relation → Select "users" collection → Single
- `patient` - Relation → Select "patients" collection → Single
- `chief_complaint` - Plain text
- `appointment_date` - Date
- `appointment_time` - Plain text
- `status` - Plain text
- `soap_subjective` - Plain text
- `soap_objective` - Plain text
- `soap_assessment` - Plain text
- `soap_plan` - Plain text

5. **API Rules** tab:
   - List rule: `@request.auth.id != ""`
   - View rule: `@request.auth.id != ""`
   - Create rule: `@request.auth.id != ""`
   - Update rule: `@request.auth.id != ""`
   - Delete rule: `@request.auth.id != ""`

6. Click "Create"

## Step 3: Create Templates Collection

1. Click "New collection"
2. Name: `templates`
3. Type: Base collection
4. Add these fields:

- `user` - Relation → Select "users" collection → Single
- `chief_complaint` - Plain text
- `soap_subjective` - Plain text
- `soap_objective` - Plain text
- `soap_assessment` - Plain text
- `soap_plan` - Plain text

5. **API Rules** (same as notes):
   - All rules: `@request.auth.id != ""`

6. Click "Create"

## Step 3: Create User Settings Collection

1. Click "New collection"
2. Name: `user_settings`
3. Type: Base collection
4. Add these fields:

- `user` - Relation → Select "users" collection → Single → Required
- `appointment_types` - JSON
- `appointment_types_default` - Plain text
- `appointment_specialties` - JSON
- `appointment_specialties_default` - Plain text

5. **API Rules** (same as above):
   - All rules: `@request.auth.id != ""`

6. Click "Create"

## Step 4: Test

1. Refresh http://localhost:3000/dashboard/notes
2. You should see an empty notes list (no errors)
3. Try creating a patient
4. Try creating a note

## Quick Reference

**Collections needed:**
- ✅ patients (already exists)
- ✅ waitlist (already exists)
- ⏳ notes (create manually)
- ⏳ templates (create manually)
- ⏳ user_settings (create manually)

**API Rule for all:**
```
@request.auth.id != ""
```

This allows any authenticated user to access their data.

---

**After manual setup, your app should work!** 🎉
