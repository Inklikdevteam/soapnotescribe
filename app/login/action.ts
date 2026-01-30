'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/pocketbase/server'
import { cookies } from 'next/headers'

export type AuthResult = {
  message?: string | null;
}

export async function login(formData: FormData) {
  const pb = createServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const authData = await pb.collection('users').authWithPassword(email, password)
    
    // Set auth cookie with the raw auth store data
    const cookieStore = cookies()
    
    // Store the auth data as JSON
    const authValue = JSON.stringify({
      token: pb.authStore.token,
      model: pb.authStore.model,
    })
    
    cookieStore.set('pb_auth', authValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { error: null }
  } catch (error: any) {
    return { error: error?.message || 'Login failed' }
  }
}

export async function signup(formData: FormData) {
  const pb = createServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      emailVisibility: true,
    })

    revalidatePath('/', 'layout')
    redirect('/auth/notification')
  } catch (error: any) {
    console.error('Signup error:', error)
    redirect('/error')
  }
}