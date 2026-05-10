import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

function safePasswordEquals(provided: string, expected: string): boolean {
  try {
    const a = Buffer.from(provided, 'utf8')
    const b = Buffer.from(expected, 'utf8')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  try {
    const expected = process.env.ADMIN_PASSWORD
    if (!expected?.length) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD is not configured on the server.' },
        { status: 500 },
      )
    }

    const body = (await request.json()) as { password?: string }
    const password = typeof body.password === 'string' ? body.password : ''

    if (!safePasswordEquals(password, expected)) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }
}
