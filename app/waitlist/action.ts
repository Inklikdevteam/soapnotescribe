'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/pocketbase/server'


export async function waitlist(formData: FormData) {
  const pb = createServerClient()

  const data = {
    email: formData.get('email') as string,
    note: formData.get('note') as string,
  }

  try {
    await pb.collection('waitlist').create({
      email: data.email,
      note: data.note,
    })

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    console.error(error)
    redirect('/error')
  }
}