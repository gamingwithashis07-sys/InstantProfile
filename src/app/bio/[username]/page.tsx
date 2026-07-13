import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

export default async function PublicBioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const page = await prisma.bioPage.findUnique({
    where: { username },
    include: {
      links: { orderBy: { sortOrder: 'asc' } },
      theme: true,
    },
  })
  if (!page) notFound()

  const colors = page.theme?.colors || page.themeColor || '#f4a261'
  const colorArr = colors.split(',').map(c => c.trim())

  return (
    <html>
      <body style={{
        margin: 0,
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colorArr[0] || '#f4a261'}, ${colorArr[1] || colorArr[0] || '#e8a87c'})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: 20,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(16px)',
          borderRadius: 24,
          padding: 40,
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
        }}>
          {page.avatarUrl ? (
            <img src={page.avatarUrl} alt="" style={{
              width: 96, height: 96, borderRadius: 48,
              objectFit: 'cover', margin: '0 auto 16px', display: 'block',
              border: '4px solid rgba(255,255,255,0.3)',
            }} />
          ) : (
            <div style={{
              width: 96, height: 96, borderRadius: 48,
              background: 'rgba(255,255,255,0.2)',
              margin: '0 auto 16px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 36, color: '#fff', fontWeight: 'bold',
              border: '4px solid rgba(255,255,255,0.3)',
            }}>
              {page.title[0]?.toUpperCase() || '?'}
            </div>
          )}
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>{page.title}</h1>
          {page.bio && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: '0 0 24px' }}>{page.bio}</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {page.links.map(link => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                display: 'block',
                padding: '14px 20px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 14,
                color: '#fff',
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: 500,
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              >
                {link.title || link.url}
              </a>
            ))}
          </div>
        </div>
      </body>
    </html>
  )
}
