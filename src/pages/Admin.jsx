import { useCallback, useEffect, useState } from 'react'
import { Trash2, RefreshCw, Plus, Save, LogOut, Upload } from 'lucide-react'
import { apiGet, apiSend } from '../lib/api'
import { PATTERNS } from '../lib/patterns'

const TABS = ['Submissions', 'Gallery', 'Chapters', 'Events', 'Team', 'Testimonials']

/* ───────────────────────── shell ───────────────────────── */

function Admin() {
  const [token, setToken] = useState(null)

  return (
    <div className="container-devs min-h-[80vh] py-16 md:py-20">
      {token ? (
        <Dashboard token={token} onLogout={() => setToken(null)} />
      ) : (
        <Login onToken={setToken} />
      )}
    </div>
  )
}

function Login({ onToken }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { token } = await apiSend('/api/admin/login', { body: { password } })
      onToken(token)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto mt-12 max-w-sm">
      <p className="eyebrow">Restricted</p>
      <h1 className="mt-4 text-4xl font-bold uppercase tracking-tighter text-white">
        Admin.
      </h1>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6">
        <div>
          <label htmlFor="admin-pass" className="label-field">
            Password
          </label>
          <input
            id="admin-pass"
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-white">⚠ {error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-50">
          {busy ? 'Checking…' : 'Enter'}
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted/60">
          Session lives in memory — refreshing logs you out.
        </p>
      </form>
    </div>
  )
}

function Dashboard({ token, onLogout }) {
  const [tab, setTab] = useState('Submissions')

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1 className="mt-3 text-4xl font-bold uppercase tracking-tighter text-white">
            Control room.
          </h1>
        </div>
        <button type="button" onClick={onLogout} className="btn-ghost text-sm">
          <LogOut size={15} /> Log out
        </button>
      </div>

      <div className="no-scrollbar -mx-6 mt-8 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full border px-5 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
              tab === t
                ? 'border-white bg-white text-black'
                : 'border-border text-muted hover:border-white/40 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'Submissions' && <SubmissionsTab token={token} />}
        {tab === 'Gallery' && <GalleryTab token={token} />}
        {tab === 'Chapters' && <ChaptersTab token={token} />}
        {tab === 'Events' && <EventsTab token={token} />}
        {tab === 'Team' && <TeamTab token={token} />}
        {tab === 'Testimonials' && <TestimonialsTab token={token} />}
      </div>
    </>
  )
}

/* ─────────────────────── primitives ─────────────────────── */

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="label-field">{label}</span>
      {children}
    </label>
  )
}

function TabHeader({ count, label, onRefresh, error }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {String(count).padStart(2, '0')} {label}
      </p>
      <div className="flex items-center gap-3">
        {error && <p className="text-sm text-white">⚠ {error}</p>}
        <button type="button" onClick={onRefresh} className="btn-ghost px-4 py-2 text-xs">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>
    </div>
  )
}

const inputSm = 'input-field px-3 py-2 text-sm'

/* ─────────────────────── submissions ─────────────────────── */

const SUB_FILTERS = ['All', 'Builders', 'Chapters']

function SubmissionsTab({ token }) {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')

  const load = useCallback(() => {
    setError('')
    apiGet('/api/submissions', token)
      .then(setRows)
      .catch((e) => setError(e.message))
  }, [token])

  useEffect(load, [load])

  const remove = async (id) => {
    await apiSend(`/api/submissions/${id}`, { method: 'DELETE', token })
    setRows((r) => r.filter((x) => x.id !== id))
  }

  const visible = rows.filter((s) => {
    if (filter === 'Builders') return s.kind === 'builder'
    if (filter === 'Chapters') return s.kind === 'chapter'
    return true
  })

  return (
    <>
      <TabHeader count={visible.length} label="form submissions" onRefresh={load} error={error} />

      <div className="no-scrollbar -mx-6 mb-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:px-0">
        {SUB_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors ${
              filter === f ? 'border-white bg-white text-black' : 'border-border text-muted hover:border-white/40 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
          No submissions yet. They land here the moment someone sends a form.
        </p>
      )}
      <div className="space-y-3">
        {visible.map((s) => (
          <article key={s.id} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${s.kind === 'builder' ? 'border-white text-white' : 'border-border text-muted'}`}>
                  {s.kind}
                </span>
                <span className="font-semibold text-white">{s.name}</span>
                <span className="text-sm text-muted">{s.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted/60">
                  {s.created_at}
                </span>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  className="text-muted transition-colors hover:text-white"
                  aria-label={`Delete submission from ${s.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {s.phone && <Row k="Phone" v={s.phone} />}
              {s.college && <Row k="College" v={s.college} />}
              {s.year && <Row k="Year" v={s.year} />}
              {s.intent && <Row k={s.kind === 'builder' ? 'Type' : 'Intent'} v={s.intent} />}
              {s.building && <Row k="Building" v={s.building} wide />}
              {s.why && <Row k="Why" v={s.why} wide />}
              {s.message && <Row k="Message" v={s.message} wide />}
            </dl>
          </article>
        ))}
      </div>
    </>
  )
}

function Row({ k, v, wide }) {
  return (
    <div className={`flex gap-2 ${wide ? 'sm:col-span-2' : ''}`}>
      <dt className="shrink-0 font-mono text-[10px] uppercase leading-6 tracking-[0.12em] text-muted/70">
        {k}:
      </dt>
      <dd className="text-muted">{v}</dd>
    </div>
  )
}

/* ───────────────────────── gallery ───────────────────────── */

const PATTERN_NAMES = Object.keys(PATTERNS)
const ASPECTS = ['aspect-square', 'aspect-[4/5]', 'aspect-[3/2]', 'aspect-[16/9]']
const ASPECT_LABELS = {
  'aspect-square': 'Square 1:1',
  'aspect-[4/5]': 'Portrait 4:5',
  'aspect-[3/2]': 'Landscape 3:2',
  'aspect-[16/9]': 'Wide 16:9',
}

function GalleryTab({ token }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [draft, setDraft] = useState({ title: '', category: 'Meetups', meta: '', aspect: 'aspect-[16/9]' })
  const [draftFile, setDraftFile] = useState(null)

  const load = useCallback(() => {
    apiGet('/api/gallery').then(setItems).catch((e) => setError(e.message))
  }, [])
  useEffect(load, [load])

  const add = async (e) => {
    e.preventDefault()
    try {
      setError('')
      const form = new FormData()
      Object.entries(draft).forEach(([k, v]) => form.append(k, v))
      if (draftFile) form.append('image', draftFile)
      await apiSend('/api/gallery', { token, form })
      setDraft({ title: '', category: 'Meetups', meta: '', aspect: 'aspect-[16/9]' })
      setDraftFile(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <TabHeader count={items.length} label="gallery frames" onRefresh={load} error={error} />

      {/* Add frame */}
      <form onSubmit={add} className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-6">
        <Field label="Title">
          <input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={inputSm} />
        </Field>
        <Field label="Category">
          <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={inputSm} />
        </Field>
        <Field label="Meta">
          <input value={draft.meta} onChange={(e) => setDraft({ ...draft, meta: e.target.value })} className={inputSm} />
        </Field>
        <Field label="Shape">
          <select value={draft.aspect} onChange={(e) => setDraft({ ...draft, aspect: e.target.value })} className={inputSm}>
            {ASPECTS.map((a) => <option key={a} value={a}>{ASPECT_LABELS[a]}</option>)}
          </select>
        </Field>
        <Field label="Image">
          <input type="file" accept="image/*" onChange={(e) => setDraftFile(e.target.files?.[0] || null)} className={`${inputSm} file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black`} />
        </Field>
        <button type="submit" className="btn-primary self-end py-2.5 text-sm">
          <Plus size={15} /> Add frame
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => (
          <GalleryCard key={g.id} item={g} token={token} onChanged={load} onError={setError} />
        ))}
      </div>
    </>
  )
}

function GalleryCard({ item, token, onChanged, onError }) {
  const [g, setG] = useState(item)
  const [file, setFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    setG(item)
    setRemoveImage(false)
  }, [item])

  const save = async () => {
    try {
      setBusy(true)
      const form = new FormData()
      ;['title', 'category', 'meta', 'pattern', 'aspect'].forEach((k) => form.append(k, g[k] ?? ''))
      if (file) form.append('image', file)
      else if (removeImage) form.append('remove_image', 'true')
      await apiSend(`/api/gallery/${item.id}`, { method: 'PUT', token, form })
      setFile(null)
      setRemoveImage(false)
      onChanged()
    } catch (err) {
      onError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    await apiSend(`/api/gallery/${item.id}`, { method: 'DELETE', token })
    onChanged()
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
        {g.image_url ? (
          <img src={g.image_url} alt={g.title} loading="lazy" className="h-full w-full object-cover grayscale" />
        ) : (
          <>
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.1]" style={PATTERNS[g.pattern] || PATTERNS.dots} />
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              No image
            </span>
          </>
        )}
      </div>
      <div className="space-y-2.5 p-4">
        <input value={g.title} onChange={(e) => setG({ ...g, title: e.target.value })} className={inputSm} aria-label="Frame title" />
        <div className="grid grid-cols-2 gap-2.5">
          <input value={g.category ?? ''} onChange={(e) => setG({ ...g, category: e.target.value })} className={inputSm} aria-label="Category" placeholder="Category" />
          <input value={g.meta ?? ''} onChange={(e) => setG({ ...g, meta: e.target.value })} className={inputSm} aria-label="Meta" placeholder="Meta" />
          <select value={g.pattern ?? 'dots'} onChange={(e) => setG({ ...g, pattern: e.target.value })} className={inputSm} aria-label="Pattern">
            {PATTERN_NAMES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={g.aspect ?? 'aspect-square'} onChange={(e) => setG({ ...g, aspect: e.target.value })} className={inputSm} aria-label="Aspect ratio">
            {ASPECTS.map((a) => <option key={a} value={a}>{ASPECT_LABELS[a] || a}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:text-white">
            <Upload size={13} />
            {file ? file.name : g.image_url ? 'Replace image' : 'Upload image'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          {g.image_url && !file && (
            <button
              type="button"
              onClick={() => setRemoveImage((v) => !v)}
              className={`font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${removeImage ? 'text-white' : 'text-muted/60 hover:text-white'}`}
            >
              {removeImage ? '✕ will remove on save' : '✕ remove image'}
            </button>
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          <button type="button" onClick={save} disabled={busy} className="btn-primary px-4 py-2 text-xs disabled:opacity-50">
            <Save size={13} /> {busy ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={remove} className="text-muted transition-colors hover:text-white" aria-label={`Delete ${g.title}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}

/* ──────────────────────── chapters ──────────────────────── */

const EMPTY_CHAPTER = { code: '', name: '', location: '', note: 'Active Chapter', lead_name: '', lead_initials: '', lead_role: 'Campus Lead' }

function ChaptersTab({ token }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [draft, setDraft] = useState(EMPTY_CHAPTER)

  const load = useCallback(() => {
    apiGet('/api/chapters').then(setItems).catch((e) => setError(e.message))
  }, [])
  useEffect(load, [load])

  const add = async (e) => {
    e.preventDefault()
    try {
      setError('')
      await apiSend('/api/chapters', { token, body: draft })
      setDraft(EMPTY_CHAPTER)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <TabHeader count={items.length} label="chapters" onRefresh={load} error={error} />

      <form onSubmit={add} className="mb-8 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-surface p-5 lg:grid-cols-4">
        <Field label="Code *"><input required value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} className={inputSm} placeholder="REC" /></Field>
        <Field label="College name *"><input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputSm} /></Field>
        <Field label="Location"><input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className={inputSm} /></Field>
        <Field label="Note"><input value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} className={inputSm} /></Field>
        <Field label="Lead name"><input value={draft.lead_name} onChange={(e) => setDraft({ ...draft, lead_name: e.target.value })} className={inputSm} /></Field>
        <Field label="Lead initials"><input value={draft.lead_initials} onChange={(e) => setDraft({ ...draft, lead_initials: e.target.value })} className={inputSm} placeholder="SA" /></Field>
        <Field label="Lead role"><input value={draft.lead_role} onChange={(e) => setDraft({ ...draft, lead_role: e.target.value })} className={inputSm} /></Field>
        <button type="submit" className="btn-primary self-end py-2.5 text-sm">
          <Plus size={15} /> Add chapter
        </button>
      </form>

      <div className="space-y-3">
        {items.map((c) => (
          <ChapterRow key={c.id} item={c} token={token} onChanged={load} onError={setError} />
        ))}
      </div>
    </>
  )
}

function ChapterRow({ item, token, onChanged, onError }) {
  const [c, setC] = useState(item)
  const [file, setFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    setC(item)
    setRemoveImage(false)
  }, [item])

  const save = async () => {
    try {
      setBusy(true)
      const form = new FormData()
      ;['code', 'name', 'location', 'note', 'lead_name', 'lead_initials', 'lead_role'].forEach((k) =>
        form.append(k, c[k] ?? ''),
      )
      if (file) form.append('image', file)
      else if (removeImage) form.append('remove_image', 'true')
      await apiSend(`/api/chapters/${item.id}`, { method: 'PUT', token, form })
      setFile(null)
      setRemoveImage(false)
      onChanged()
    } catch (err) {
      onError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    await apiSend(`/api/chapters/${item.id}`, { method: 'DELETE', token })
    onChanged()
  }

  const bind = (k) => ({
    value: c[k] ?? '',
    onChange: (e) => setC({ ...c, [k]: e.target.value }),
    className: inputSm,
  })

  return (
    <article className="rounded-2xl border border-border bg-surface p-4">
      {/* Chapter fields */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        <input {...bind('code')} aria-label="Code" placeholder="Code" />
        <input {...bind('name')} aria-label="Name" placeholder="College name" className={`${inputSm} col-span-2`} />
        <input {...bind('location')} aria-label="Location" placeholder="Location" />
        <input {...bind('note')} aria-label="Note" placeholder="Note" />
      </div>

      {/* Lead section */}
      <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center">
        {file || (c.lead_image && !removeImage) ? (
          <img
            src={file ? URL.createObjectURL(file) : c.lead_image}
            alt="Lead"
            className="h-11 w-11 shrink-0 rounded-lg object-cover grayscale"
          />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-dashed border-border font-mono text-[10px] text-muted" aria-hidden="true">
            lead
          </span>
        )}
        <div className="grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-3">
          <input {...bind('lead_name')} aria-label="Lead name" placeholder="Lead name" />
          <input {...bind('lead_initials')} aria-label="Lead initials" placeholder="Init." />
          <input {...bind('lead_role')} aria-label="Lead role" placeholder="Lead role" />
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:text-white">
            <Upload size={13} />
            {file ? 'photo set' : c.lead_image ? 'replace' : 'photo'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          {c.lead_image && !file && (
            <button
              type="button"
              onClick={() => setRemoveImage((v) => !v)}
              className={`font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${removeImage ? 'text-white' : 'text-muted/60 hover:text-white'}`}
            >
              {removeImage ? '✕ removing' : '✕'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <button type="button" onClick={save} disabled={busy} className="btn-primary px-3.5 py-2 text-xs disabled:opacity-50">
            <Save size={13} /> {busy ? '…' : 'Save'}
          </button>
          <button type="button" onClick={remove} className="text-muted transition-colors hover:text-white" aria-label={`Delete ${c.code}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}

/* ───────────────────────── events ───────────────────────── */

const EMPTY_EVENT = {
  title: '', type: 'Community Meetup', description: '', date_text: '', time_text: '',
  venue: '', capacity: '', format: '', register_link: '', status: 'upcoming',
}

function EventsTab({ token }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [draft, setDraft] = useState(EMPTY_EVENT)
  const [draftFile, setDraftFile] = useState(null)

  const load = useCallback(() => {
    apiGet('/api/events').then(setItems).catch((e) => setError(e.message))
  }, [])
  useEffect(load, [load])

  const add = async (e) => {
    e.preventDefault()
    try {
      setError('')
      const form = new FormData()
      Object.entries(draft).forEach(([k, v]) => form.append(k, v))
      if (draftFile) form.append('image', draftFile)
      await apiSend('/api/events', { token, form })
      setDraft(EMPTY_EVENT)
      setDraftFile(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const bindDraft = (k) => ({
    value: draft[k],
    onChange: (e) => setDraft({ ...draft, [k]: e.target.value }),
    className: inputSm,
  })

  return (
    <>
      <TabHeader count={items.length} label="events" onRefresh={load} error={error} />

      <form onSubmit={add} className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Title *"><input required {...bindDraft('title')} /></Field>
        <Field label="Type"><input {...bindDraft('type')} /></Field>
        <Field label="Status">
          <select {...bindDraft('status')}>
            <option value="upcoming">upcoming</option>
            <option value="past">past</option>
          </select>
        </Field>
        <Field label="Date"><input {...bindDraft('date_text')} placeholder="Saturday, July 12" /></Field>
        <Field label="Time"><input {...bindDraft('time_text')} placeholder="9:00 AM – 1:00 PM" /></Field>
        <Field label="Venue"><input {...bindDraft('venue')} /></Field>
        <Field label="Capacity"><input {...bindDraft('capacity')} placeholder="50 builders max" /></Field>
        <Field label="Format"><input {...bindDraft('format')} placeholder="Stories → Tables → Chai" /></Field>
        <Field label="Register link"><input {...bindDraft('register_link')} placeholder="https://…" /></Field>
        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea rows={2} {...bindDraft('description')} className={`${inputSm} resize-y`} />
          </Field>
        </div>
        <div className="flex items-end gap-3">
          <Field label="Image">
            <input type="file" accept="image/*" onChange={(e) => setDraftFile(e.target.files?.[0] || null)} className={`${inputSm} file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black`} />
          </Field>
          <button type="submit" className="btn-primary shrink-0 py-2.5 text-sm">
            <Plus size={15} /> Add event
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {items.map((ev) => (
          <EventRow key={ev.id} item={ev} token={token} onChanged={load} onError={setError} />
        ))}
      </div>
    </>
  )
}

function EventRow({ item, token, onChanged, onError }) {
  const [e, setE] = useState(item)
  const [file, setFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    setE(item)
    setRemoveImage(false)
  }, [item])

  const save = async () => {
    try {
      setBusy(true)
      const form = new FormData()
      Object.keys(EMPTY_EVENT).forEach((k) => form.append(k, e[k] ?? ''))
      if (file) form.append('image', file)
      else if (removeImage) form.append('remove_image', 'true')
      await apiSend(`/api/events/${item.id}`, { method: 'PUT', token, form })
      setFile(null)
      setRemoveImage(false)
      onChanged()
    } catch (err) {
      onError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    await apiSend(`/api/events/${item.id}`, { method: 'DELETE', token })
    onChanged()
  }

  const bind = (k) => ({
    value: e[k] ?? '',
    onChange: (ev) => setE({ ...e, [k]: ev.target.value }),
    className: inputSm,
  })

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
        <div className="relative min-h-[120px] overflow-hidden border-b border-border md:border-b-0 md:border-r">
          {e.image_url ? (
            <img src={e.image_url} alt={e.title} loading="lazy" className="h-full w-full object-cover grayscale" />
          ) : (
            <>
              <div aria-hidden="true" className="absolute inset-0 opacity-[0.1]" style={PATTERNS.dots} />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                No image
              </span>
            </>
          )}
        </div>
        <div className="space-y-2.5 p-4">
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            <input {...bind('title')} aria-label="Title" placeholder="Title" className={`${inputSm} col-span-2`} />
            <input {...bind('type')} aria-label="Type" placeholder="Type" />
            <select {...bind('status')} aria-label="Status">
              <option value="upcoming">upcoming</option>
              <option value="past">past</option>
            </select>
            <input {...bind('date_text')} aria-label="Date" placeholder="Date" />
            <input {...bind('time_text')} aria-label="Time" placeholder="Time" />
            <input {...bind('venue')} aria-label="Venue" placeholder="Venue" />
            <input {...bind('capacity')} aria-label="Capacity" placeholder="Capacity" />
            <input {...bind('format')} aria-label="Format" placeholder="Format" className={`${inputSm} col-span-2`} />
            <input {...bind('register_link')} aria-label="Register link" placeholder="Register link" className={`${inputSm} col-span-2`} />
          </div>
          <textarea rows={2} {...bind('description')} aria-label="Description" placeholder="Description" className={`${inputSm} w-full resize-y`} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:text-white">
                <Upload size={13} />
                {file ? file.name : e.image_url ? 'Replace image' : 'Upload image'}
                <input type="file" accept="image/*" className="hidden" onChange={(ev) => setFile(ev.target.files?.[0] || null)} />
              </label>
              {e.image_url && !file && (
                <button
                  type="button"
                  onClick={() => setRemoveImage((v) => !v)}
                  className={`font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${removeImage ? 'text-white' : 'text-muted/60 hover:text-white'}`}
                >
                  {removeImage ? '✕ will remove on save' : '✕ remove image'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={save} disabled={busy} className="btn-primary px-4 py-2 text-xs disabled:opacity-50">
                <Save size={13} /> {busy ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={remove} className="text-muted transition-colors hover:text-white" aria-label={`Delete ${e.title}`}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

/* ───────────────────────── team ───────────────────────── */

const EMPTY_MEMBER = { name: '', role: '', initials: '', linkedin: '' }

function TeamTab({ token }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [draft, setDraft] = useState(EMPTY_MEMBER)
  const [draftFile, setDraftFile] = useState(null)

  const load = useCallback(() => {
    apiGet('/api/team').then(setItems).catch((e) => setError(e.message))
  }, [])
  useEffect(load, [load])

  const add = async (e) => {
    e.preventDefault()
    try {
      setError('')
      const form = new FormData()
      Object.entries(draft).forEach(([k, v]) => form.append(k, v))
      if (draftFile) form.append('image', draftFile)
      await apiSend('/api/team', { token, form })
      setDraft(EMPTY_MEMBER)
      setDraftFile(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <TabHeader count={items.length} label="team members" onRefresh={load} error={error} />

      <form onSubmit={add} className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Name *"><input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputSm} /></Field>
        <Field label="Role"><input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} className={inputSm} placeholder="Founder" /></Field>
        <Field label="Initials"><input value={draft.initials} onChange={(e) => setDraft({ ...draft, initials: e.target.value })} className={inputSm} placeholder="SA" /></Field>
        <Field label="LinkedIn URL"><input value={draft.linkedin} onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })} className={inputSm} placeholder="https://…" /></Field>
        <Field label="Photo">
          <input type="file" accept="image/*" onChange={(e) => setDraftFile(e.target.files?.[0] || null)} className={`${inputSm} file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black`} />
        </Field>
        <button type="submit" className="btn-primary self-end py-2.5 text-sm lg:col-start-5">
          <Plus size={15} /> Add member
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <TeamCard key={m.id} item={m} token={token} onChanged={load} onError={setError} />
        ))}
      </div>
    </>
  )
}

function TeamCard({ item, token, onChanged, onError }) {
  const [m, setM] = useState(item)
  const [file, setFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    setM(item)
    setRemoveImage(false)
  }, [item])

  const save = async () => {
    try {
      setBusy(true)
      const form = new FormData()
      ;['name', 'role', 'initials', 'linkedin'].forEach((k) => form.append(k, m[k] ?? ''))
      if (file) form.append('image', file)
      else if (removeImage) form.append('remove_image', 'true')
      await apiSend(`/api/team/${item.id}`, { method: 'PUT', token, form })
      setFile(null)
      setRemoveImage(false)
      onChanged()
    } catch (err) {
      onError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    await apiSend(`/api/team/${item.id}`, { method: 'DELETE', token })
    onChanged()
  }

  const showImg = file ? URL.createObjectURL(file) : m.image_url && !removeImage ? m.image_url : null

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border">
        {showImg ? (
          <img src={showImg} alt={m.name} className="h-full w-full object-cover grayscale" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            No photo
          </span>
        )}
      </div>
      <div className="space-y-2.5 p-4">
        <input value={m.name} onChange={(e) => setM({ ...m, name: e.target.value })} className={inputSm} aria-label="Name" placeholder="Name" />
        <div className="grid grid-cols-2 gap-2.5">
          <input value={m.role ?? ''} onChange={(e) => setM({ ...m, role: e.target.value })} className={inputSm} aria-label="Role" placeholder="Role" />
          <input value={m.initials ?? ''} onChange={(e) => setM({ ...m, initials: e.target.value })} className={inputSm} aria-label="Initials" placeholder="Init." />
        </div>
        <input value={m.linkedin ?? ''} onChange={(e) => setM({ ...m, linkedin: e.target.value })} className={inputSm} aria-label="LinkedIn URL" placeholder="LinkedIn URL" />
        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:text-white">
            <Upload size={13} />
            {file ? file.name : m.image_url ? 'Replace photo' : 'Upload photo'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          {m.image_url && !file && (
            <button
              type="button"
              onClick={() => setRemoveImage((v) => !v)}
              className={`font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${removeImage ? 'text-white' : 'text-muted/60 hover:text-white'}`}
            >
              {removeImage ? '✕ will remove' : '✕ remove'}
            </button>
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          <button type="button" onClick={save} disabled={busy} className="btn-primary px-4 py-2 text-xs disabled:opacity-50">
            <Save size={13} /> {busy ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={remove} className="text-muted transition-colors hover:text-white" aria-label={`Delete ${m.name}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}

/* ─────────────────────── testimonials ─────────────────────── */

const EMPTY_TESTIMONIAL = { quote: '', author: '', role: '' }

function TestimonialsTab({ token }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [draft, setDraft] = useState(EMPTY_TESTIMONIAL)
  const [draftFile, setDraftFile] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    apiGet('/api/testimonials').then(setItems).catch((e) => setError(e.message))
  }, [])
  useEffect(load, [load])

  const add = async (e) => {
    e.preventDefault()
    if (!draftFile) {
      setError('A video file is required for new testimonials.')
      return
    }
    try {
      setError('')
      setBusy(true)
      const form = new FormData()
      Object.entries(draft).forEach(([k, v]) => form.append(k, v))
      form.append('video', draftFile)
      await apiSend('/api/testimonials', { token, form })
      setDraft(EMPTY_TESTIMONIAL)
      setDraftFile(null)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <TabHeader count={items.length} label="testimonials" onRefresh={load} error={error} />

      <form onSubmit={add} className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2">
        <Field label="Author *"><input required value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} className={inputSm} placeholder="Name or label" /></Field>
        <Field label="Role"><input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} className={inputSm} placeholder="3rd Year CSE" /></Field>
        <div className="sm:col-span-2">
          <Field label="Quote (optional caption)">
            <textarea rows={2} value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} className={`${inputSm} resize-y`} />
          </Field>
        </div>
        <Field label="Video file * (.mp4 / .webm, max 50MB, square works best)">
          <input type="file" accept="video/*" onChange={(e) => setDraftFile(e.target.files?.[0] || null)} className={`${inputSm} file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-semibold file:text-black`} />
        </Field>
        <button type="submit" disabled={busy} className="btn-primary self-end py-2.5 text-sm disabled:opacity-50">
          <Plus size={15} /> {busy ? 'Uploading…' : 'Add testimonial'}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <TestimonialCard key={t.id} item={t} token={token} onChanged={load} onError={setError} />
        ))}
      </div>
    </>
  )
}

function TestimonialCard({ item, token, onChanged, onError }) {
  const [t, setT] = useState(item)
  const [file, setFile] = useState(null)
  const [removeVideo, setRemoveVideo] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    setT(item)
    setRemoveVideo(false)
  }, [item])

  const save = async () => {
    try {
      setBusy(true)
      const form = new FormData()
      ;['quote', 'author', 'role'].forEach((k) => form.append(k, t[k] ?? ''))
      if (file) form.append('video', file)
      else if (removeVideo) form.append('remove_video', 'true')
      await apiSend(`/api/testimonials/${item.id}`, { method: 'PUT', token, form })
      setFile(null)
      setRemoveVideo(false)
      onChanged()
    } catch (err) {
      onError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    await apiSend(`/api/testimonials/${item.id}`, { method: 'DELETE', token })
    onChanged()
  }

  const previewSrc = file ? URL.createObjectURL(file) : t.video_url && !removeVideo ? t.video_url : null

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative aspect-square overflow-hidden border-b border-border bg-black">
        {previewSrc ? (
          <video src={previewSrc} controls preload="metadata" className="h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            No video
          </span>
        )}
      </div>
      <div className="space-y-2.5 p-4">
        <input value={t.author} onChange={(e) => setT({ ...t, author: e.target.value })} className={inputSm} aria-label="Author" placeholder="Author" />
        <input value={t.role ?? ''} onChange={(e) => setT({ ...t, role: e.target.value })} className={inputSm} aria-label="Role" placeholder="Role" />
        <textarea rows={2} value={t.quote ?? ''} onChange={(e) => setT({ ...t, quote: e.target.value })} className={`${inputSm} w-full resize-y`} aria-label="Quote" placeholder="Quote (optional)" />
        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted hover:text-white">
            <Upload size={13} />
            {file ? file.name.slice(0, 16) : t.video_url ? 'Replace video' : 'Upload video'}
            <input type="file" accept="video/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          {t.video_url && !file && (
            <button
              type="button"
              onClick={() => setRemoveVideo((v) => !v)}
              className={`font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${removeVideo ? 'text-white' : 'text-muted/60 hover:text-white'}`}
            >
              {removeVideo ? '✕ will remove' : '✕ remove'}
            </button>
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          <button type="button" onClick={save} disabled={busy} className="btn-primary px-4 py-2 text-xs disabled:opacity-50">
            <Save size={13} /> {busy ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={remove} className="text-muted transition-colors hover:text-white" aria-label={`Delete ${t.author}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default Admin
