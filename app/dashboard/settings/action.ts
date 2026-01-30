'use server'

import { createServerClient } from '@/utils/pocketbase/server'

export async function updateTheme(theme: string, userId: string) {
  const pb = createServerClient()
  
  try {
    // Find the user_settings record for this user
    const settings = await pb.collection('user_settings').getFullList({
      filter: `user = "${userId}"`,
    })

    if (settings.length > 0) {
      await pb.collection('user_settings').update(settings[0].id, { theme })
    } else {
      // Create if doesn't exist
      await pb.collection('user_settings').create({
        user: userId,
        theme,
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating theme:', error)
    return { success: false, error: 'Failed to save theme' }
  }
}
