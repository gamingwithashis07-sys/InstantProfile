import { redirect } from 'next/navigation'
import { initDB, getDB } from '@/lib/db'

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await initDB()
  const db = getDB()
  const link = db.get('SELECT * FROM short_links WHERE slug = ?', [slug])
  if (!link) return new Response('Not found', { status: 404 })
  db.run('UPDATE short_links SET clicks = clicks + 1 WHERE id = ?', [link.id])
  redirect(link.target_url)
}
