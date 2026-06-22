import express from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { db, DATA_DIR } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// Built frontend (created by `npm run build`). Served in production/Docker.
const DIST_DIR = path.join(__dirname, '..', 'dist')
const hasDist = fs.existsSync(path.join(DIST_DIR, 'index.html'))

const PORT = process.env.PORT || process.env.API_PORT || 5174
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'devs2025'

const app = express()
app.use(express.json())
app.use('/uploads', express.static(UPLOAD_DIR))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'DEVS API' })
})

/* ── Uploads ─────────────────────────────────────────────── */
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    cb(null, /^image\//.test(file.mimetype)),
})

function removeUpload(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return
  const file = path.join(UPLOAD_DIR, path.basename(imageUrl))
  fs.unlink(file, () => {})
}

// Separate uploader for testimonial videos — larger cap, video mime types.
const uploadVideo = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^video\//.test(file.mimetype)),
})

/* ── Auth — in-memory bearer tokens ─────────────────────── */
const tokens = new Set()

app.post('/api/admin/login', (req, res) => {
  if (req.body?.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' })
  }
  const token = crypto.randomUUID()
  tokens.add(token)
  res.json({ token })
})

function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer /, '')
  if (!tokens.has(token)) return res.status(401).json({ error: 'Unauthorized' })
  next()
}

/* ── Chapters ───────────────────────────────────────────── */
app.get('/api/chapters', (_req, res) => {
  res.json(db.prepare('SELECT * FROM chapters ORDER BY sort, id').all())
})

app.post('/api/chapters', requireAuth, upload.single('image'), (req, res) => {
  const b = req.body || {}
  if (!b.code || !b.name) return res.status(400).json({ error: 'code and name are required' })
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null
  const info = db
    .prepare(
      `INSERT INTO chapters (code, name, location, note, lead_name, lead_initials, lead_role, lead_image, sort)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort), 0) + 1 FROM chapters))`,
    )
    .run(
      b.code, b.name, b.location || '', b.note || 'Active Chapter',
      b.lead_name || '', b.lead_initials || '', b.lead_role || 'Campus Lead', imageUrl,
    )
  res.status(201).json(db.prepare('SELECT * FROM chapters WHERE id = ?').get(info.lastInsertRowid))
})

app.put('/api/chapters/:id', requireAuth, upload.single('image'), (req, res) => {
  const existing = db.prepare('SELECT * FROM chapters WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const c = { ...existing, ...req.body }
  let imageUrl = existing.lead_image
  if (req.file) {
    removeUpload(existing.lead_image)
    imageUrl = `/uploads/${req.file.filename}`
  } else if (req.body.remove_image === 'true') {
    removeUpload(existing.lead_image)
    imageUrl = null
  }
  db.prepare(
    `UPDATE chapters SET code=?, name=?, location=?, note=?, lead_name=?, lead_initials=?, lead_role=?, lead_image=? WHERE id=?`,
  ).run(c.code, c.name, c.location, c.note, c.lead_name, c.lead_initials, c.lead_role, imageUrl, existing.id)
  res.json(db.prepare('SELECT * FROM chapters WHERE id = ?').get(existing.id))
})

app.delete('/api/chapters/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM chapters WHERE id = ?').get(req.params.id)
  if (existing) {
    removeUpload(existing.lead_image)
    db.prepare('DELETE FROM chapters WHERE id = ?').run(existing.id)
  }
  res.status(204).end()
})

/* ── Team (founders) ────────────────────────────────────── */
app.get('/api/team', (_req, res) => {
  res.json(db.prepare('SELECT * FROM team ORDER BY sort, id').all())
})

app.post('/api/team', requireAuth, upload.single('image'), (req, res) => {
  const b = req.body || {}
  if (!b.name) return res.status(400).json({ error: 'name is required' })
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null
  const info = db
    .prepare(
      `INSERT INTO team (name, role, initials, linkedin, image_url, sort)
       VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort), 0) + 1 FROM team))`,
    )
    .run(b.name, b.role || '', b.initials || '', b.linkedin || '', imageUrl)
  res.status(201).json(db.prepare('SELECT * FROM team WHERE id = ?').get(info.lastInsertRowid))
})

app.put('/api/team/:id', requireAuth, upload.single('image'), (req, res) => {
  const existing = db.prepare('SELECT * FROM team WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const t = { ...existing, ...req.body }
  let imageUrl = existing.image_url
  if (req.file) {
    removeUpload(existing.image_url)
    imageUrl = `/uploads/${req.file.filename}`
  } else if (req.body.remove_image === 'true') {
    removeUpload(existing.image_url)
    imageUrl = null
  }
  db.prepare(
    `UPDATE team SET name=?, role=?, initials=?, linkedin=?, image_url=? WHERE id=?`,
  ).run(t.name, t.role, t.initials, t.linkedin, imageUrl, existing.id)
  res.json(db.prepare('SELECT * FROM team WHERE id = ?').get(existing.id))
})

app.delete('/api/team/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM team WHERE id = ?').get(req.params.id)
  if (existing) {
    removeUpload(existing.image_url)
    db.prepare('DELETE FROM team WHERE id = ?').run(existing.id)
  }
  res.status(204).end()
})

/* ── Testimonials (video) ───────────────────────────────── */
app.get('/api/testimonials', (_req, res) => {
  res.json(db.prepare('SELECT * FROM testimonials ORDER BY sort, id').all())
})

app.post('/api/testimonials', requireAuth, uploadVideo.single('video'), (req, res) => {
  const b = req.body || {}
  if (!b.author) return res.status(400).json({ error: 'author is required' })
  const videoUrl = req.file ? `/uploads/${req.file.filename}` : null
  const info = db
    .prepare(
      `INSERT INTO testimonials (quote, author, role, video_url, sort)
       VALUES (?, ?, ?, ?, (SELECT COALESCE(MAX(sort), 0) + 1 FROM testimonials))`,
    )
    .run(b.quote || '', b.author, b.role || '', videoUrl)
  res.status(201).json(db.prepare('SELECT * FROM testimonials WHERE id = ?').get(info.lastInsertRowid))
})

app.put('/api/testimonials/:id', requireAuth, uploadVideo.single('video'), (req, res) => {
  const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const t = { ...existing, ...req.body }
  let videoUrl = existing.video_url
  if (req.file) {
    removeUpload(existing.video_url)
    videoUrl = `/uploads/${req.file.filename}`
  } else if (req.body.remove_video === 'true') {
    removeUpload(existing.video_url)
    videoUrl = null
  }
  db.prepare(
    `UPDATE testimonials SET quote=?, author=?, role=?, video_url=? WHERE id=?`,
  ).run(t.quote, t.author, t.role, videoUrl, existing.id)
  res.json(db.prepare('SELECT * FROM testimonials WHERE id = ?').get(existing.id))
})

app.delete('/api/testimonials/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id)
  if (existing) {
    removeUpload(existing.video_url)
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(existing.id)
  }
  res.status(204).end()
})

/* ── Gallery ────────────────────────────────────────────── */
app.get('/api/gallery', (_req, res) => {
  res.json(db.prepare('SELECT * FROM gallery ORDER BY sort, id').all())
})

app.post('/api/gallery', requireAuth, upload.single('image'), (req, res) => {
  const { title, category = 'Community', meta = '', pattern = 'dots', aspect = 'aspect-square' } = req.body || {}
  if (!title) return res.status(400).json({ error: 'title is required' })
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null
  const info = db
    .prepare(
      `INSERT INTO gallery (title, category, meta, pattern, aspect, image_url, sort)
       VALUES (?, ?, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort), 0) + 1 FROM gallery))`,
    )
    .run(title, category, meta, pattern, aspect, imageUrl)
  res.status(201).json(db.prepare('SELECT * FROM gallery WHERE id = ?').get(info.lastInsertRowid))
})

app.put('/api/gallery/:id', requireAuth, upload.single('image'), (req, res) => {
  const existing = db.prepare('SELECT * FROM gallery WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const g = { ...existing, ...req.body }
  let imageUrl = existing.image_url
  if (req.file) {
    removeUpload(existing.image_url)
    imageUrl = `/uploads/${req.file.filename}`
  } else if (req.body.remove_image === 'true') {
    removeUpload(existing.image_url)
    imageUrl = null
  }
  db.prepare(
    `UPDATE gallery SET title=?, category=?, meta=?, pattern=?, aspect=?, image_url=? WHERE id=?`,
  ).run(g.title, g.category, g.meta, g.pattern, g.aspect, imageUrl, existing.id)
  res.json(db.prepare('SELECT * FROM gallery WHERE id = ?').get(existing.id))
})

app.delete('/api/gallery/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM gallery WHERE id = ?').get(req.params.id)
  if (existing) {
    removeUpload(existing.image_url)
    db.prepare('DELETE FROM gallery WHERE id = ?').run(existing.id)
  }
  res.status(204).end()
})

/* ── Events ─────────────────────────────────────────────── */
app.get('/api/events', (_req, res) => {
  res.json(db.prepare('SELECT * FROM events ORDER BY created_at DESC, id DESC').all())
})

app.post('/api/events', requireAuth, upload.single('image'), (req, res) => {
  const b = req.body || {}
  if (!b.title) return res.status(400).json({ error: 'title is required' })
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null
  const info = db
    .prepare(
      `INSERT INTO events (title, type, description, date_text, time_text, venue, capacity, format, register_link, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      b.title, b.type || 'Community Meetup', b.description || '', b.date_text || '',
      b.time_text || '', b.venue || '', b.capacity || '', b.format || '',
      b.register_link || '', imageUrl, b.status || 'upcoming',
    )
  res.status(201).json(db.prepare('SELECT * FROM events WHERE id = ?').get(info.lastInsertRowid))
})

app.put('/api/events/:id', requireAuth, upload.single('image'), (req, res) => {
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const e = { ...existing, ...req.body }
  let imageUrl = existing.image_url
  if (req.file) {
    removeUpload(existing.image_url)
    imageUrl = `/uploads/${req.file.filename}`
  } else if (req.body.remove_image === 'true') {
    removeUpload(existing.image_url)
    imageUrl = null
  }
  db.prepare(
    `UPDATE events SET title=?, type=?, description=?, date_text=?, time_text=?, venue=?, capacity=?, format=?, register_link=?, image_url=?, status=? WHERE id=?`,
  ).run(
    e.title, e.type, e.description, e.date_text, e.time_text, e.venue,
    e.capacity, e.format, e.register_link, imageUrl, e.status, existing.id,
  )
  res.json(db.prepare('SELECT * FROM events WHERE id = ?').get(existing.id))
})

app.delete('/api/events/:id', requireAuth, (req, res) => {
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
  if (existing) {
    removeUpload(existing.image_url)
    db.prepare('DELETE FROM events WHERE id = ?').run(existing.id)
  }
  res.status(204).end()
})

/* ── Form submissions ───────────────────────────────────── */
app.post('/api/submissions', (req, res) => {
  const b = req.body || {}
  if (!b.kind || !['builder', 'chapter', 'join', 'contact'].includes(b.kind)) {
    return res.status(400).json({ error: 'invalid submission kind' })
  }
  const info = db
    .prepare(
      `INSERT INTO submissions (kind, name, email, phone, college, year, intent, building, why, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      b.kind, b.name || '', b.email || '', b.phone || '', b.college || '',
      b.year || '', b.intent || '', b.building || '', b.why || '', b.message || '',
    )
  res.status(201).json({ id: info.lastInsertRowid })
})

app.get('/api/submissions', requireAuth, (_req, res) => {
  res.json(db.prepare('SELECT * FROM submissions ORDER BY id DESC').all())
})

app.delete('/api/submissions/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM submissions WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

/* ── Static frontend (production / Docker) ──────────────── */
if (hasDist) {
  app.use(express.static(DIST_DIR))
  // SPA fallback: any non-API, non-upload GET serves index.html so client
  // routes like /admin or /gallery work on refresh.
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next()
    }
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
} else {
  // Dev mode: Vite serves the frontend; this is just a friendly root.
  app.get('/', (_req, res) =>
    res.json({ ok: true, service: 'DEVS API', app: 'http://localhost:5173' }),
  )
}

/* ── Errors ─────────────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(400).json({ error: err.message || 'Request failed' })
})

app.listen(PORT, () => {
  console.log(`DEVS server running on http://localhost:${PORT}`)
})
