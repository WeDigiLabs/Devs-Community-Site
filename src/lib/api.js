/* Thin fetch helpers for the DEVS API. Admin tokens live in React state only
   (no storage APIs), so a dashboard refresh requires logging in again. */

export async function apiGet(path, token) {
  const res = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error(`GET ${path} failed (${res.status})`)
  return res.json()
}

export async function apiSend(path, { method = 'POST', token, body, form } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`

  let payload
  if (form) {
    payload = form // FormData — browser sets the multipart boundary
  } else {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body ?? {})
  }

  const res = await fetch(path, { method, headers, body: payload })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `${method} ${path} failed (${res.status})`)
  }
  return res.status === 204 ? null : res.json()
}
