import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const DB_PATH = path.join(process.cwd(), 'data.db')
let _db: any = null
let _wrapped: any = null

function toArray(params: any): any[] {
  if (params === undefined || params === null) return []
  return Array.isArray(params) ? params : [params]
}

function save() {
  try {
    const data = _db.export()
    fs.writeFileSync(DB_PATH, Buffer.from(data))
  } catch (e: any) { console.error('Save error:', e.message) }
}

function wrap(db: any) {
  return {
    get(sql: string, params?: any) {
      try {
        const stmt = db.prepare(sql)
        stmt.bind(toArray(params))
        if (stmt.step()) { const row = stmt.getAsObject(); stmt.free(); return row }
        stmt.free()
      } catch (e) {}
      return undefined
    },
    all(sql: string, params?: any) {
      const rows: any[] = []
      try {
        const stmt = db.prepare(sql)
        stmt.bind(toArray(params))
        while (stmt.step()) rows.push(stmt.getAsObject())
        stmt.free()
      } catch (e) {}
      return rows
    },
    run(sql: string, params?: any) {
      db.run(sql, toArray(params))
      const lastId = db.exec('SELECT last_insert_rowid() as id')
      const lr = lastId && lastId[0]?.values?.[0]?.[0] ? lastId[0].values[0][0] : null
      save()
      return { lastInsertRowid: lr, changes: db.getRowsModified() }
    },
  }
}

export async function initDB() {
  if (_wrapped) return _wrapped

  const SQL = await initSqlJs()
  if (fs.existsSync(DB_PATH)) {
    _db = new SQL.Database(fs.readFileSync(DB_PATH))
  } else {
    _db = new SQL.Database()
  }

  // ─── Core tables ───
  _db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    balance REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)
  try { _db.run('ALTER TABLE users ADD COLUMN balance REAL DEFAULT 0') } catch (e) {}

  _db.run(`CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT,
    detail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  _db.run(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`)

  // ─── Instagram accounts (Graph API connected) ───
  _db.run(`CREATE TABLE IF NOT EXISTS ig_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    ig_user_id TEXT NOT NULL,
    ig_username TEXT NOT NULL,
    ig_business_id TEXT,
    access_token TEXT NOT NULL,
    token_expires_at DATETIME,
    avatar_url TEXT,
    follower_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`)

  // ─── Auto DM campaigns ───
  _db.run(`CREATE TABLE IF NOT EXISTS dm_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ig_account_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    message_template TEXT NOT NULL,
    trigger_type TEXT NOT NULL DEFAULT 'manual',
    delay_minutes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft',
    sent_count INTEGER DEFAULT 0,
    settings TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ig_account_id) REFERENCES ig_accounts(id)
  )`)
  try { _db.run('ALTER TABLE dm_campaigns ADD COLUMN settings TEXT') } catch (e) {}

  // ─── DM recipients / queue ───
  _db.run(`CREATE TABLE IF NOT EXISTS dm_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER,
    ig_account_id INTEGER NOT NULL,
    recipient_id TEXT,
    recipient_username TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    sent_at DATETIME,
    error TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES dm_campaigns(id),
    FOREIGN KEY (ig_account_id) REFERENCES ig_accounts(id)
  )`)

  // ─── Scheduled posts ───
  _db.run(`CREATE TABLE IF NOT EXISTS scheduled_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ig_account_id INTEGER NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image',
    caption TEXT,
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    scheduled_at DATETIME NOT NULL,
    status TEXT DEFAULT 'scheduled',
    published_at DATETIME,
    error TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ig_account_id) REFERENCES ig_accounts(id)
  )`)

  // ─── Auto reply templates ───
  _db.run(`CREATE TABLE IF NOT EXISTS auto_replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ig_account_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    trigger_type TEXT NOT NULL,
    trigger_keyword TEXT,
    reply_type TEXT NOT NULL DEFAULT 'dm',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    used_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ig_account_id) REFERENCES ig_accounts(id)
  )`)

  // ─── Hashtag groups ───
  _db.run(`CREATE TABLE IF NOT EXISTS hashtag_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ig_account_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    hashtags TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ig_account_id) REFERENCES ig_accounts(id)
  )`)

  // ─── DM conversations ───
  _db.run(`CREATE TABLE IF NOT EXISTS dm_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ig_account_id INTEGER NOT NULL,
    participant_id TEXT,
    participant_username TEXT NOT NULL,
    last_message TEXT,
    unread INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ig_account_id) REFERENCES ig_accounts(id)
  )`)

  // ─── Analytics cache ───
  _db.run(`CREATE TABLE IF NOT EXISTS analytics_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ig_account_id INTEGER NOT NULL,
    data_type TEXT NOT NULL,
    data TEXT NOT NULL,
    cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ig_account_id) REFERENCES ig_accounts(id)
  )`)

  // ─── Link shortener ───
  _db.run(`CREATE TABLE IF NOT EXISTS short_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    title TEXT,
    clicks INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`)

  // ─── Bio pages (Link-in-Bio) ───
  _db.run(`CREATE TABLE IF NOT EXISTS bio_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    theme_color TEXT DEFAULT '#f4a261',
    username TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`)
  _db.run(`CREATE TABLE IF NOT EXISTS bio_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bio_page_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bio_page_id) REFERENCES bio_pages(id)
  )`)

  // ─── Content ideas ───
  _db.run(`CREATE TABLE IF NOT EXISTS content_ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    idea TEXT NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`)

  // ─── Caption templates ───
  _db.run(`CREATE TABLE IF NOT EXISTS caption_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`)

  // ─── QR codes ───
  _db.run(`CREATE TABLE IF NOT EXISTS qr_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    target_url TEXT NOT NULL,
    bg_color TEXT DEFAULT '#ffffff',
    fg_color TEXT DEFAULT '#000000',
    downloads INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`)

  // ─── Digital products ───
  _db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL DEFAULT 0,
    type TEXT NOT NULL DEFAULT 'digital',
    file_url TEXT,
    image_url TEXT,
    slug TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    policies TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`)
  try { _db.run('ALTER TABLE products ADD COLUMN policies TEXT') } catch (e) {}

  _db.run(`CREATE TABLE IF NOT EXISTS digital_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    download_token TEXT UNIQUE NOT NULL,
    razorpay_order_id TEXT,
    payment_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`)
  try { _db.run('ALTER TABLE digital_orders ADD COLUMN razorpay_order_id TEXT') } catch (e) {}
  try { _db.run('ALTER TABLE digital_orders ADD COLUMN payment_id TEXT') } catch (e) {}

  _db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_id INTEGER,
    amount REAL NOT NULL,
    type TEXT NOT NULL DEFAULT 'credit',
    description TEXT,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES digital_orders(id)
  )`)

  // ─── Seed admin ───
  const stmt = _db.prepare('SELECT id FROM users WHERE username = ?')
  stmt.bind(['admin'])
  const exists = stmt.step()
  stmt.free()
  if (!exists) {
    const hash = bcrypt.hashSync('admin123', 10)
    _db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hash, 'admin'])
  }

  // ─── Seed defaults ───
  const countStmt = _db.prepare('SELECT COUNT(*) as c FROM settings')
  countStmt.step()
  const countRow = countStmt.getAsObject()
  countStmt.free()
  if (countRow.c === 0) {
    const defaults = [
      ['site_name', 'InstaAutomate'],
      ['site_description', 'Instagram Automation Platform — DM, Schedule, Analyze'],
      ['theme', 'dark'],
      ['accent_color', '#f4a261'],
      ['graph_api_version', 'v21.0'],
      ['fb_app_id', ''],
      ['fb_app_secret', ''],
      ['admin_secret_code', 'admin2024'],
    ]
    defaults.forEach((s) => _db.run('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)', s))
  }

  save()
  _wrapped = wrap(_db)
  return _wrapped
}

export function getDB() { return _wrapped }

export function logActivity(user: string, action: string, target: string, detail: string) {
  try {
    _wrapped?.run('INSERT INTO activity_log (user, action, target, detail) VALUES (?, ?, ?, ?)', [user, action, target, detail])
  } catch (e) {}
}
