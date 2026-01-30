'use server'

import { createServerClient } from '@/utils/pocketbase/server'
import { revalidatePath } from 'next/cache'

export async function createNoteFromAudio(patientId: string, audioData?: string, audioFileName?: string, audioMimeType?: string) {
  const pb = createServerClient()
  
  if (!pb.authStore.isValid || !pb.authStore.model?.id) {
    return { error: 'User not authenticated' }
  }
  
  const userId = pb.authStore.model.id
  
  try {
    // Fetch patient data
    const patient = await pb.collection('patients').getOne(patientId)
    
    // Fetch user settings
    const settings = await pb.collection('user_settings').getFullList({
      filter: `user = "${userId}"`,
    })
    const userSettings = settings[0] || {}

    // Create FormData for file upload
    const formData = new FormData()
    formData.append('user', userId)
    formData.append('patient', patientId)
    formData.append('allergies', patient?.allergies || '')
    formData.append('appointment_type', userSettings?.appointment_types_default || '')
    formData.append('appointment_specialty', userSettings?.appointment_specialties_default || '')
    formData.append('status', 'processing')
    
    // If audio data is provided, convert base64 to file and attach
    if (audioData && audioFileName && audioMimeType) {
      // Convert base64 to blob
      const base64Data = audioData.split(',')[1] || audioData
      const binaryData = Buffer.from(base64Data, 'base64')
      const blob = new Blob([binaryData], { type: audioMimeType })
      formData.append('audio_file', blob, audioFileName)
    }

    const note = await pb.collection('notes').create(formData)
    
    revalidatePath('/dashboard/notes')
    
    return { success: true, noteId: note.id }
  } catch (error: any) {
    console.error('Failed to create note:', error)
    return { error: error?.message || 'Failed to create note' }
  }
}
