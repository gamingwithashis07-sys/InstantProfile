import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const VERIFY_TOKEN = 'instantprofile_verify_2024'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const entry = body?.entry?.[0]

    if (!entry) return NextResponse.json({ status: 'ok' })

    const igUserId = entry.id
    const changes = entry.changes?.[0]
    const field = changes?.field

    if (field === 'comments') {
      const commentId = changes?.value?.id
      const text = changes?.value?.text || ''
      const fromId = changes?.value?.from?.id

      if (commentId && fromId) {
        const campaigns = await prisma.dmCampaign.findMany({
          where: {
            igAccount: { igUserId: String(igUserId) },
            triggerType: 'comment',
            status: 'active',
          },
          include: { igAccount: true },
        })

        for (const campaign of campaigns) {
          await prisma.dmQueue.create({
            data: {
              campaignId: campaign.id,
              igAccountId: campaign.igAccountId,
              recipientId: String(fromId),
              recipientUsername: changes.value.from?.username || `user_${fromId}`,
              message: campaign.messageTemplate.replace(/{{username}}/g, changes.value.from?.username || 'User'),
              status: 'pending',
            },
          })
        }
      }
    }

    if (field === 'live_comments') {
      const commentId = changes?.value?.id
      const text = changes?.value?.text || ''
      const fromId = changes?.value?.from?.id

      if (commentId && fromId) {
        const campaigns = await prisma.dmCampaign.findMany({
          where: {
            igAccount: { igUserId: String(igUserId) },
            triggerType: 'live_comment',
            status: 'active',
          },
          include: { igAccount: true },
        })

        for (const campaign of campaigns) {
          await prisma.dmQueue.create({
            data: {
              campaignId: campaign.id,
              igAccountId: campaign.igAccountId,
              recipientId: String(fromId),
              recipientUsername: changes.value.from?.username || `user_${fromId}`,
              message: campaign.messageTemplate.replace(/{{username}}/g, changes.value.from?.username || 'User'),
              status: 'pending',
            },
          })
        }
      }
    }

    if (field === 'messages') {
      const senderId = changes?.value?.sender?.id
      const messageText = changes?.value?.message || ''

      if (senderId) {
        const campaigns = await prisma.dmCampaign.findMany({
          where: {
            igAccount: { igUserId: String(igUserId) },
            triggerType: 'dm',
            status: 'active',
          },
          include: { igAccount: true },
        })

        for (const campaign of campaigns) {
          await prisma.dmQueue.create({
            data: {
              campaignId: campaign.id,
              igAccountId: campaign.igAccountId,
              recipientId: String(senderId),
              recipientUsername: changes.value.sender?.username || `user_${senderId}`,
              message: campaign.messageTemplate.replace(/{{username}}/g, changes.value.sender?.username || 'User'),
              status: 'pending',
            },
          })
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch {
    return NextResponse.json({ status: 'ok' })
  }
}
