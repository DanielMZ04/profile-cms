interface Bucket {
  count: number
  resetAt: number
}

const store = new Map<string, Bucket>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now()
  const bucket = store.get(ip)

  if (!bucket || bucket.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryAfterMs: 0 }
  }

  if (bucket.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now }
  }

  bucket.count++
  return { allowed: true, retryAfterMs: 0 }
}

export function resetLoginRateLimit(ip: string) {
  store.delete(ip)
}

// Cleanup old entries every hour to prevent memory growth
setInterval(() => {
  const now = Date.now()
  store.forEach((bucket, key) => {
    if (bucket.resetAt <= now) store.delete(key)
  })
}, 60 * 60 * 1000)
