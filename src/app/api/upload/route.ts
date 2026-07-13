import { NextRequest, NextResponse } from 'next/server'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')
    const mimeType = file.type || 'application/octet-stream'
    const dataUri = `data:${mimeType};base64,${base64}`

    return NextResponse.json({ url: dataUri, name: file.name, size: file.size, type: mimeType })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 })
  }
}
