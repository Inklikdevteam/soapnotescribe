import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  
  // Clear PocketBase auth cookie
  cookieStore.delete('pb_auth')

  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}