'use server'

import { unstable_noStore as noStore, revalidatePath  } from 'next/cache';
import { createServerClient } from '@/utils/pocketbase/server'
import { Note, NoteWithPatient, PatientForTable, NoteForTable, Template } from './definitions';
import { redirect } from 'next/navigation';

const ITEMS_PER_PAGE = 6;

// NOTE

export async function fetchFilteredNotes(query: string, currentPage: number) {
  noStore()
  try {
    const pb = createServerClient()
    
    // Fetch all notes with expanded patient relation
    const notes = await pb.collection('notes').getFullList({
      expand: 'patient',
      sort: '-appointment_date',
    })

    // Filter notes based on query
    const notesFiltered = notes.filter(note => {
      const patient = note.expand?.patient
      if (!patient) return false
      
      return patient.first_name?.toLowerCase().includes(query.toLowerCase())
        || patient.middle_name?.toLowerCase().includes(query.toLowerCase())
        || patient.last_name?.toLowerCase().includes(query.toLowerCase())
        || note.chief_complaint?.toLowerCase().includes(query.toLowerCase())
        || note.status?.toLowerCase().includes(query.toLowerCase())
        || (patient.first_name?.toLowerCase() + ' ' + patient.last_name?.toLowerCase()).includes(query.toLowerCase())
    })

    // Custom sorting logic: processing at top, then "awaiting review", then "approved"
    notesFiltered.sort((a, b) => {
      if (a.status === 'processing' && b.status !== 'processing') return -1
      if (a.status !== 'processing' && b.status === 'processing') return 1
      
      if (a.status === 'awaiting review' && b.status !== 'awaiting review') return -1
      if (a.status !== 'awaiting review' && b.status === 'awaiting review') return 1
      
      if (a.status === 'draft' && b.status !== 'draft') return -1
      if (a.status !== 'draft' && b.status === 'draft') return 1
      
      if (a.status === b.status) {
        const aDate = new Date(a.appointment_date)
        const bDate = new Date(b.appointment_date)
        return bDate.getTime() - aDate.getTime()
      }
      
      return 0
    })

    const offset = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedNotes = notesFiltered.slice(offset, offset + ITEMS_PER_PAGE).map(note => ({
      id: note.id,
      chief_complaint: note.chief_complaint,
      status: note.status,
      appointment_date: note.appointment_date,
      patient: {
        id: note.expand?.patient?.id,
        first_name: note.expand?.patient?.first_name,
        middle_name: note.expand?.patient?.middle_name,
        last_name: note.expand?.patient?.last_name,
      }
    }))
    
    const totalPages = Math.ceil(notesFiltered.length / ITEMS_PER_PAGE) || 1

    return { paginatedNotes, totalPages }

  } catch (error) {
    console.error('PocketBase Error:', error)
    throw new Error('Failed to fetch appointments data.')
  }
}

export async function fetchNotesPages(query: string) {
  try {
    const pb = createServerClient()
    const notes = await pb.collection('notes').getFullList()
    const totalPages = Math.ceil(notes.length / ITEMS_PER_PAGE) || 1
    return totalPages
  } catch (error) {
    console.error('PocketBase Error:', error)
    throw new Error('Failed to fetch notes count.')
  }
}

export async function fetchNoteById(id: string) {
  try {
    const pb = createServerClient()
    const note = await pb.collection('notes').getOne(id, {
      expand: 'patient',
    })

    if (!note) {
      throw new Error(`Note with ID ${id} not found.`)
    }

    // Transform to match NoteWithPatient type
    return {
      ...note,
      patient_id: note.patient,
      patient: {
        id: note.expand?.patient?.id,
        first_name: note.expand?.patient?.first_name,
        middle_name: note.expand?.patient?.middle_name,
        last_name: note.expand?.patient?.last_name,
        email: note.expand?.patient?.email,
        date_of_birth: note.expand?.patient?.date_of_birth,
        allergies: note.expand?.patient?.allergies,
        phone: note.expand?.patient?.phone,
        provider: note.expand?.patient?.provider,
        profile_notes: note.expand?.patient?.profile_notes,
        address_street: note.expand?.patient?.address_street,
        address_unit: note.expand?.patient?.address_unit,
        state: note.expand?.patient?.state,
        city: note.expand?.patient?.city,
        zipcode: note.expand?.patient?.zipcode,
      }
    } as NoteWithPatient
  } catch (error) {
    console.error('Error fetching note:', error)
    throw new Error('Failed to fetch note data.')
  }
}

export async function getSignedAudioUrl(userId: string, audio_url: string) {
  try {
    const pb = createServerClient()
    // In PocketBase, files are accessed directly via the record
    // We need to fetch the note that has this audio file
    const notes = await pb.collection('notes').getFullList({
      filter: `user = "${userId}" && audio_file != ""`,
    })
    
    // Find the note with matching audio file
    const note = notes.find(n => n.audio_file === audio_url)
    if (!note) {
      throw new Error('Audio file not found')
    }
    
    // Generate file URL
    const url = pb.files.getUrl(note, note.audio_file)
    return url
  } catch (error) {
    console.error('PocketBase Error:', error)
    throw new Error('Failed to get audio URL.')
  }
}

export async function deleteNote(formData: FormData) {
  const id = formData.get('id') as string
  
  const pb = createServerClient()

  try {
    await pb.collection('notes').delete(id)
    console.log('Note deleted successfully')
    revalidatePath('/dashboard/notes')
    redirect('/dashboard/notes')
  } catch (error) {
    console.error('Error deleting note from PocketBase:', error)
    throw new Error('Failed to delete the note.')
  }
}

// TEMPLATES

export async function fetchTemplates() {
  noStore()
  try {
    const pb = createServerClient()
    const templates = await pb.collection('templates').getFullList()
    return templates as Template[]
  } catch (error) {
    console.error('PocketBase Error:', error)
    throw new Error('Failed to fetch templates data.')
  }
}

export async function fetchTemplateById(id: string) {
  noStore()
  try {
    const pb = createServerClient()
    const template = await pb.collection('templates').getOne(id)
    return template
  } catch (error) {
    console.error('PocketBase Error:', error)
    throw new Error('Failed to fetch template data.')
  }
}

export async function deleteTemplate(id: string) {
  const pb = createServerClient()

  try {
    await pb.collection('templates').delete(id)
    return { success: true }
  } catch (error) {
    console.error('Error deleting template from PocketBase:', error)
    throw new Error('Failed to delete the template.')
  }
}

// PATIENTS

export async function fetchPatients() {
  noStore()
  try {
    const pb = createServerClient()
    const patients = await pb.collection('patients').getFullList({
      sort: 'last_name',
    })
    return patients
  } catch (error) {
    console.error('PocketBase Error:', error)
    throw new Error('Failed to fetch patients data.')
  }
}

export async function fetchPatientsWithSameName(first_name: string, last_name: string) {
  try {
    const pb = createServerClient()
    const patients = await pb.collection('patients').getFullList({
      filter: `first_name = "${first_name}" && last_name = "${last_name}"`,
    })
    return patients
  } catch (error) {
    console.error('Error fetching patients by name:', error)
    throw new Error('Failed to fetch patients by name data')
  }
}

export async function checkForExistingPatient(formData: FormData) {
  let first_name = formData.get('first_name') as string
  let last_name = formData.get('last_name') as string

  let patientsWithSameName = await fetchPatientsWithSameName(first_name, last_name)
  
  if (patientsWithSameName.length > 0) {
    return { exists: true, patients: patientsWithSameName }
  } else { 
    await addPatient(formData)
    return { exists: false }
  }
}

export async function addPatient(formData: FormData) {
  const pb = createServerClient()

  try {
    const patient = await pb.collection('patients').create({
      first_name: formData.get('first_name') as string,
      middle_name: formData.get('middle_name') as string,
      last_name: formData.get('last_name') as string,
      date_of_birth: formData.get('date_of_birth') as string,
      phone: formData.get('patient_phone') as string,
      email: formData.get('email') as string,
      address_street: formData.get('address_street') as string,
      address_unit: formData.get('address_unit') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: formData.get('country') as string,
      zipcode: formData.get('zipcode') as string,
      allergies: formData.get('allergies') as string,
      referral_source: formData.get('referral_source') as string,
      profile_notes: formData.get('profile_notes') as string,
      pharmacy_name: formData.get('pharmacy_name') as string,
      pharmacy_phone: formData.get('pharmacy_phone') as string,
    })

    redirect(`/dashboard/patients/${patient.id}`)
  } catch (error) {
    console.error('PocketBase error creating patient:', error)
    throw new Error('Failed to create patient.')
  }
}

export async function editPatient(formData: FormData) {
  const pb = createServerClient()
  let patientId = formData.get('id') as string

  try {
    await pb.collection('patients').update(patientId, {
      first_name: formData.get('first_name') as string,
      middle_name: formData.get('middle_name') as string,
      last_name: formData.get('last_name') as string,
      date_of_birth: formData.get('date_of_birth') as string,
      phone: formData.get('patient_phone') as string,
      email: formData.get('email') as string,
      address_street: formData.get('address_street') as string,
      address_unit: formData.get('address_unit') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: formData.get('country') as string,
      zipcode: formData.get('zipcode') as string,
      allergies: formData.get('allergies') as string,
      referral_source: formData.get('referral_source') as string,
      profile_notes: formData.get('profile_notes') as string,
      pharmacy_name: formData.get('pharmacy_name') as string,
      pharmacy_phone: formData.get('pharmacy_phone') as string,
    })

    redirect(`/dashboard/patients/${patientId}`)
  } catch (error) {
    console.error('PocketBase error updating patient:', error)
    throw new Error('Failed to update patient.')
  }
}

export async function fetchPatientsWithQuery(query: string, currentPage: number) {
  noStore()
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  
  try {
    const pb = createServerClient()
    
    let patients;
    if (query && query.trim()) {
      patients = await pb.collection('patients').getFullList({
        filter: `first_name ~ "${query}" || middle_name ~ "${query}" || last_name ~ "${query}"`,
        sort: 'last_name',
      })
    } else {
      patients = await pb.collection('patients').getFullList({
        sort: 'last_name',
      })
    }

    const paginatedPatients = patients.slice(offset, offset + ITEMS_PER_PAGE)
    return paginatedPatients as PatientForTable[]
  } catch (error) {
    console.error('PocketBase Error:', error)
    throw new Error('Failed to fetch patients data.')
  }
}

export async function countPatientPagesWithQuery(query: string) {
  noStore()
  
  try {
    const pb = createServerClient()
    
    let patients;
    if (query && query.trim()) {
      patients = await pb.collection('patients').getFullList({
        filter: `first_name ~ "${query}" || middle_name ~ "${query}" || last_name ~ "${query}"`,
      })
    } else {
      patients = await pb.collection('patients').getFullList()
    }

    const pages = Math.ceil(patients.length / ITEMS_PER_PAGE) || 1
    return pages
  } catch (error) {
    console.error('PocketBase Error:', error)
    throw new Error('Failed to fetch patients data.')
  }
}

export async function fetchPatientCount() {
  try {
    const pb = createServerClient()
    const patients = await pb.collection('patients').getFullList()
    return patients.length
  } catch (error) {
    console.error('Unexpected Error:', error)
    throw new Error('Failed to fetch patient count due to an unexpected error.')
  }
}

export async function fetchPatientById(id: string) {
  noStore()
  try {
    const pb = createServerClient()
    const patient = await pb.collection('patients').getOne(id)
    return patient
  } catch (error) {
    console.error('PocketBase Error:', error)
    throw new Error('Failed to fetch patient data.')
  }
}

export async function fetchPatientProfileById(id: string) {
  noStore()
  try {
    const pb = createServerClient()
    
    // Fetch patient
    const patient = await pb.collection('patients').getOne(id)
    
    // Fetch notes for this patient
    const notes = await pb.collection('notes').getFullList({
      filter: `patient = "${id}"`,
      sort: '-appointment_date',
    })

    return {
      ...patient,
      note: notes.map(n => ({
        id: n.id,
        appointment_type: n.appointment_type,
        chief_complaint: n.chief_complaint,
        appointment_date: n.appointment_date,
        appointment_specialty: n.appointment_specialty,
        status: n.status,
      }))
    }
  } catch (error) {
    console.error('PocketBase Error:', error)
    throw new Error('Failed to fetch patient data.')
  }
}

// USER_SETTINGS

export async function fetchUserSettings() {
  noStore()
  try {
    const pb = createServerClient()
    const userId = pb.authStore.model?.id
    
    if (!userId) {
      // Return defaults if not authenticated
      return {
        appointment_types: [],
        appointment_types_default: '',
        appointment_specialties: [],
        appointment_specialties_default: '',
        theme: 'light',
        user_id: '',
      }
    }

    const settings = await pb.collection('user_settings').getFullList({
      filter: `user = "${userId}"`,
    })
    
    // Return defaults if no settings exist
    if (!settings || settings.length === 0) {
      return {
        appointment_types: [],
        appointment_types_default: '',
        appointment_specialties: [],
        appointment_specialties_default: '',
        theme: 'light',
        user_id: userId,
      }
    }
    
    return settings[0]
  } catch (error) {
    console.error('PocketBase Error:', error)
    // Return defaults on error instead of throwing
    return {
      appointment_types: [],
      appointment_types_default: '',
      appointment_specialties: [],
      appointment_specialties_default: '',
      theme: 'light',
      user_id: '',
    }
  }
}

export async function updateUserSettings(payload: any, userId: string) {
  noStore()
  const pb = createServerClient()
  
  try {
    // Find the user_settings record for this user
    const settings = await pb.collection('user_settings').getFullList({
      filter: `user = "${userId}"`,
    })

    if (settings.length > 0) {
      await pb.collection('user_settings').update(settings[0].id, payload)
    } else {
      // Create if doesn't exist
      await pb.collection('user_settings').create({
        user: userId,
        ...payload,
      })
    }
  } catch (error) {
    console.log('Error updating user settings:', error)
  }
}

// AUTH / USER

export const fetchUserSession = async () => {
  try {
    const pb = createServerClient()
    
    if (pb.authStore.isValid && pb.authStore.model) {
      return {
        user: pb.authStore.model,
        access_token: pb.authStore.token,
      }
    }
    
    return null
  } catch (error) {
    console.error('PocketBase Error:', error)
    throw new Error('Failed to fetch user session.')
  }
}
