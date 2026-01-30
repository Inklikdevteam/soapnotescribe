# PocketBase Migration Guide

## Step 1: Install PocketBase

### Windows:
1. Download PocketBase from https://pocketbase.io/docs/
2. Extract `pocketbase.exe` to your project root
3. Run: `pocketbase.exe serve`

PocketBase will start on http://127.0.0.1:8090

## Step 2: Initial Setup

1. Open http://127.0.0.1:8090/_/ in your browser
2. Create your admin account
3. PocketBase will create a `pb_data` folder (add to .gitignore)

## Step 3: Collections to Create

Create these collections in PocketBase Admin UI:

### 1. patients
- first_name (text)
- middle_name (text, optional)
- last_name (text)
- email (email, optional)
- phone (text, optional)
- date_of_birth (date, optional)
- gender (text, optional)
- sex (text, optional)
- address_street (text, optional)
- address_unit (text, optional)
- city (text, optional)
- state (text, optional)
- country (text, optional)
- zipcode (text, optional)
- allergies (text, optional)
- pharmacy_name (text, optional)
- pharmacy_phone (text, optional)
- profile_notes (text, optional)
- provider (text, optional)
- referral_source (text, optional)

### 2. notes
- user (relation to users)
- patient (relation to patients)
- chief_complaint (text, optional)
- appointment_date (date, optional)
- appointment_time (text)
- appointment_type (text, optional)
- appointment_specialty (text, optional)
- appointment_summary (text, optional)
- audio_transcript (text, optional)
- audio_file (file, optional)
- pdf_file (file, optional)
- soap_subjective (text, optional)
- soap_objective (text, optional)
- soap_assessment (text, optional)
- soap_plan (text, optional)
- patient_instructions (text, optional)
- differential_diagnosis (text, optional)
- discharge_instructions (text, optional)
- allergies (text, optional)
- patient_age_years (number, optional)
- patient_location (text, optional)
- status (text, optional)
- consent (bool, optional)
- doctor_signature (text, optional)
- feedback (text, optional)
- transcription_cost (number, optional)
- analysis_cost (number, optional)
- transcription_time (text, optional)
- combined_text (text, optional)
- image_urls (json, optional)

### 3. templates
- user (relation to users)
- chief_complaint (text, optional)
- soap_subjective (text, optional)
- soap_objective (text, optional)
- soap_assessment (text, optional)
- soap_plan (text, optional)
- patient_instructions (text, optional)

### 4. user_settings
- user (relation to users, unique)
- appointment_types (json, optional)
- appointment_types_default (text, optional)
- appointment_specialties (json, optional)
- appointment_specialties_default (text, optional)

### 5. waitlist
- email (email)
- note (text, optional)

## Step 4: Code Changes

Files to update:
- Remove all Supabase client files
- Create PocketBase client wrapper
- Update middleware for PocketBase auth
- Update all data fetching functions
- Update file upload logic

## Step 5: Environment Variables

Update `.env.local`:
```
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

## Step 6: Run Migration

After setup, your app will use PocketBase instead of Supabase.
