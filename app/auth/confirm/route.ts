import { type NextRequest, NextResponse } from 'next/server'

// PocketBase handles email confirmation automatically
// This route can be simplified or removed
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (token) {
    // Redirect to login with success message
    return NextResponse.redirect(new URL('/login?confirmed=true', request.url))
  }

  // Redirect to error page if no token
  return NextResponse.redirect(new URL('/error', request.url))
}