/**
 * In-memory store mapping IP addresses to submission timestamps.
 */
const rateLimitMap = new Map<string, number[]>();
let lastCleanup = Date.now();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * Checks rate limit for a given IP address.
 *
 * @param ip Client IP address
 * @param limit Maximum allowed requests within window (default: 5)
 * @param windowMs Window duration in milliseconds (default: 10 minutes = 600,000 ms)
 */
export function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 600000,
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Lazy cleanup of the map to prevent memory leaks
  if (now - lastCleanup > windowMs) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const valid = timestamps.filter((ts) => ts > windowStart);
      if (valid.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, valid);
      }
    }
    lastCleanup = now;
  }

  const timestamps = rateLimitMap.get(ip) ?? [];
  // Filter out timestamps outside the active window
  const validTimestamps = timestamps.filter((ts) => ts > windowStart);

  if (validTimestamps.length >= limit) {
    const oldestTimestamp = validTimestamps[0];
    const resetMs = oldestTimestamp + windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);

  return {
    allowed: true,
    remaining: limit - validTimestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Extracts client IP address from Next.js Headers object.
 *
 * @param headers ReadonlyHeaders or Headers instance
 */
export function getClientIp(headers: Headers): string {
  // Prefer x-real-ip as it's typically set by trusted proxies (like Vercel/Cloudflare)
  // and is less susceptible to basic spoofing than x-forwarded-for.
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }

  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }

  return "127.0.0.1";
}
