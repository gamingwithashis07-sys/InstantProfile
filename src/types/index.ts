export interface User {
  id: number; username: string; password?: string; role: 'admin' | 'user'; created_at: string
}

export interface IgAccount {
  id: number; user_id: number; ig_user_id: string; ig_username: string
  ig_business_id?: string; access_token: string; token_expires_at?: string
  avatar_url?: string; follower_count: number; status: string; created_at: string
}

export interface DmCampaign {
  id: number; ig_account_id: number; name: string; message_template: string
  trigger_type: string; delay_minutes: number; status: string; sent_count: number; created_at: string
}

export interface DmQueueItem {
  id: number; campaign_id?: number; ig_account_id: number; recipient_id?: string
  recipient_username: string; message: string; status: string; sent_at?: string; error?: string; created_at: string
}

export interface ScheduledPost {
  id: number; ig_account_id: number; media_type: string; caption?: string
  media_url: string; thumbnail_url?: string; scheduled_at: string; status: string
  published_at?: string; error?: string; created_at: string
}

export interface AutoReply {
  id: number; ig_account_id: number; name: string; trigger_type: string
  trigger_keyword?: string; reply_type: string; message: string; status: string
  used_count: number; created_at: string
}

export interface HashtagGroup {
  id: number; ig_account_id: number; name: string; hashtags: string; created_at: string
}

export interface DmConversation {
  id: number; ig_account_id: number; participant_id?: string; participant_username: string
  last_message?: string; unread: number; created_at: string
}

export interface Product {
  id: number; user_id: number; title: string; description?: string
  price: number; type: string; file_url?: string; image_url?: string
  slug: string; status: string; created_at: string
}

export interface DigitalOrder {
  id: number; user_id: number; product_id: number; amount: number
  status: string; download_token: string; created_at: string
  product_title?: string; product_slug?: string
}

export interface DashboardStats {
  totalAccounts: number; totalDmSent: number; totalPosts: number; totalAutoReplies: number
  followerGrowth: number; engagementRate: number
}
