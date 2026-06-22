import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// DATA_DIR lets Docker point the database + uploads at a mounted volume so
// content persists across container rebuilds. Falls back to ./server locally.
export const DATA_DIR = process.env.DATA_DIR || __dirname
fs.mkdirSync(DATA_DIR, { recursive: true })

export const db = new DatabaseSync(path.join(DATA_DIR, 'devs.db'))

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS chapters (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    code          TEXT NOT NULL,
    name          TEXT NOT NULL,
    location      TEXT DEFAULT '',
    note          TEXT DEFAULT 'Active Chapter',
    lead_name     TEXT DEFAULT '',
    lead_initials TEXT DEFAULT '',
    lead_role     TEXT DEFAULT 'Campus Lead',
    sort          INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    title     TEXT NOT NULL,
    category  TEXT DEFAULT 'Community',
    meta      TEXT DEFAULT '',
    pattern   TEXT DEFAULT 'dots',
    aspect    TEXT DEFAULT 'aspect-square',
    image_url TEXT,
    sort      INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS events (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    type          TEXT DEFAULT 'Community Meetup',
    description   TEXT DEFAULT '',
    date_text     TEXT DEFAULT '',
    time_text     TEXT DEFAULT '',
    venue         TEXT DEFAULT '',
    capacity      TEXT DEFAULT '',
    format        TEXT DEFAULT '',
    register_link TEXT DEFAULT '',
    image_url     TEXT,
    status        TEXT DEFAULT 'upcoming',
    created_at    TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    kind       TEXT NOT NULL,
    name       TEXT DEFAULT '',
    email      TEXT DEFAULT '',
    phone      TEXT DEFAULT '',
    college    TEXT DEFAULT '',
    year       TEXT DEFAULT '',
    intent     TEXT DEFAULT '',
    building   TEXT DEFAULT '',
    why        TEXT DEFAULT '',
    message    TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS team (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL,
    role      TEXT DEFAULT '',
    initials  TEXT DEFAULT '',
    linkedin  TEXT DEFAULT '',
    image_url TEXT,
    sort      INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    quote     TEXT DEFAULT '',
    author    TEXT NOT NULL,
    role      TEXT DEFAULT '',
    video_url TEXT,
    sort      INTEGER DEFAULT 0
  );
`)

/* Lightweight migrations for columns added after the first release. */
function ensureColumn(table, column, ddl) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all()
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`)
  }
}
ensureColumn('chapters', 'lead_image', 'lead_image TEXT')

/* Seed initial content once so the public site matches what was static. */
function seed() {
  const count = (table) =>
    db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n

  if (count('chapters') === 0) {
    const ins = db.prepare(
      `INSERT INTO chapters (code, name, location, note, lead_name, lead_initials, lead_role, sort)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    ins.run('REC', 'Rajalakshmi Engineering College', 'Chennai, Tamil Nadu', 'Founding Chapter', 'Swayam Annamalai', 'SA', 'Founder · Campus Lead', 0)
    ins.run('VSB', 'VSB College', 'Coimbatore, Tamil Nadu', 'Active Chapter', '', '', 'Campus Lead', 1)
    ins.run('NEC', 'NEC College', 'Erode, Tamil Nadu', 'Active Chapter', '', '', 'Campus Lead', 2)
    ins.run('RAMCO', 'Ramco College', 'Rajapalayam, Tamil Nadu', 'Active Chapter', '', '', 'Campus Lead', 3)
  }

  if (count('gallery') === 0) {
    const ins = db.prepare(
      `INSERT INTO gallery (title, category, meta, pattern, aspect, sort) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    const frames = [
      ['DEVS Meetup #001', 'Meetups', 'Chennai · 50 builders', 'dots', 'aspect-[4/5]'],
      ['Geekify U', 'Workshops', 'Multi-domain bootcamp', 'diag', 'aspect-square'],
      ['Devathon', 'Hackathons', 'Guided hackathon', 'grid', 'aspect-[3/2]'],
      ['The 800+ Symposium', 'Community', 'Record turnout', 'rings', 'aspect-square'],
      ['P2P Hub Sessions', 'Workshops', 'Students teach students', 'lines', 'aspect-[4/5]'],
      ['DevFest', 'DevFest', 'Annual mega event', 'cross', 'aspect-[3/2]'],
      ['Build Nights', 'Meetups', 'Late hours, real work', 'grid', 'aspect-square'],
      ['Chapter Launches', 'Community', 'New colleges, new crews', 'diag', 'aspect-[4/5]'],
      ['Open Mic Rounds', 'Meetups', 'No stage. No script.', 'rings', 'aspect-[3/2]'],
      ['Domain Workshops', 'Workshops', 'AI/ML · Cyber · UI/UX', 'dots', 'aspect-square'],
      ['DevFest After Hours', 'DevFest', 'Networking floor', 'lines', 'aspect-[4/5]'],
      ['The Core Team', 'Community', 'The people behind it', 'cross', 'aspect-square'],
    ]
    frames.forEach((f, i) => ins.run(...f, i))
  }

  if (count('testimonials') === 0) {
    const ins = db.prepare(
      `INSERT INTO testimonials (quote, author, role, sort) VALUES (?, ?, ?, ?)`,
    )
    ins.run('DEVS gave me my first real technical network before I even graduated.', 'REC Student', '3rd Year CSE', 0)
    ins.run('The kind of room where a startup founder and a first-year student are having the same conversation.', 'Student Entrepreneur', 'Building in public', 1)
    ins.run("Finally a community in Chennai that's not just another college fest.", 'Developer', '2 years exp', 2)
  }

  if (count('team') === 0) {
    const ins = db.prepare(
      `INSERT INTO team (name, role, initials, linkedin, sort) VALUES (?, ?, ?, ?, ?)`,
    )
    ins.run('Swayam Annamalai', 'Founder', 'SA', 'https://linkedin.com/in/devswayam', 0)
    ins.run('Rishabh Venkatraman', 'Co-Founder', 'RV', 'https://linkedin.com/in/rishabh-venkatraman', 1)
  }

  if (count('events') === 0) {
    db.prepare(
      `INSERT INTO events (title, type, description, date_text, time_text, venue, capacity, format, register_link, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'upcoming')`,
    ).run(
      'DEVS Meetup #001',
      'Community Meetup',
      "Chennai's first outside-college builder meetup. A room of 50 developers, entrepreneurs, creators, and students. Three story sparks. Open tables. Chai. Real conversations. No stage. No hierarchy.",
      'Saturday Morning',
      '9:00 AM – 1:00 PM',
      'Chennai (To be announced)',
      '50 builders max',
      'Stories → Open Tables → Open Mic → Chai',
      '',
    )
  }
}

seed()
