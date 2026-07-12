/**
 * Frontend CSRF helper — reads the csrf_token cookie and returns it
 * for inclusion in the X-CSRF-Token header on state-changing requests.
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/)
  return match ? match[1] : null
}

/**
 * Wraps fetch to automatically include CSRF token for POST/PUT/DELETE.
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method || 'GET').toUpperCase()
  const headers = new Headers(options.headers || {})

  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const token = getCsrfToken()
    if (token) headers.set('x-csrf-token', token)
  }

  return fetch(url, { ...options, headers })
}
