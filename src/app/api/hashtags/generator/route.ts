import { NextResponse } from 'next/server'
import { getUserId, unauthorized } from '@/lib/helpers'

const HASHTAG_SUGGESTIONS: Record<string, string[]> = {
  general: ['explorepage', 'viral', 'trending', 'instagood', 'photooftheday', 'like4like', 'followme', 'instadaily', 'beautiful', 'happy'],
  business: ['entrepreneur', 'marketing', 'business', 'success', 'motivation', 'startup', 'branding', 'growth', 'digitalmarketing', 'socialmedia'],
  fashion: ['fashion', 'style', 'outfit', 'ootd', 'fashionblogger', 'streetstyle', 'vintage', 'trendy', 'styleinspo', 'moda'],
  food: ['food', 'foodie', 'foodphotography', 'instafood', 'yummy', 'delicious', 'foodblogger', 'tasty', 'homemade', 'cooking'],
  travel: ['travel', 'wanderlust', 'adventure', 'explore', 'nature', 'photography', 'tourism', 'vacation', 'travelgram', 'instatravel'],
  fitness: ['fitness', 'workout', 'gym', 'health', 'motivation', 'fitfam', 'exercise', 'bodybuilding', 'training', 'weightloss'],
  tech: ['technology', 'tech', 'coding', 'programming', 'developer', 'ai', 'innovation', 'software', 'startup', 'webdev'],
}

export async function GET(req: Request) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const url = new URL(req.url)
  const category = url.searchParams.get('category') || 'general'
  const count = parseInt(url.searchParams.get('count') || '10')
  const pool = HASHTAG_SUGGESTIONS[category] || HASHTAG_SUGGESTIONS.general
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count)
  return NextResponse.json({ hashtags: shuffled, category })
}
