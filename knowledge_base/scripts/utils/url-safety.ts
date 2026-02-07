/**
 * Basic URL safety checks for scraper downloads.
 *
 * This is not a complete SSRF defense (no DNS resolution). It blocks common
 * local targets and private IP literals to reduce risk when ingesting third-party HTML.
 */

function isIPv4Literal(hostname: string): boolean {
  const parts = hostname.split('.');
  if (parts.length !== 4) return false;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return false;
    const n = Number(p);
    if (!Number.isInteger(n) || n < 0 || n > 255) return false;
  }
  return true;
}

function isPrivateIPv4(hostname: string): boolean {
  if (!isIPv4Literal(hostname)) return false;
  const [a, b] = hostname.split('.').map((n) => Number(n));

  // 0.0.0.0/8, 10.0.0.0/8, 127.0.0.0/8
  if (a === 0 || a === 10 || a === 127) return true;

  // 169.254.0.0/16 (link-local)
  if (a === 169 && b === 254) return true;

  // 172.16.0.0/12
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16
  if (a === 192 && b === 168) return true;

  // 100.64.0.0/10 (CGNAT)
  if (a === 100 && b >= 64 && b <= 127) return true;

  return false;
}

function isLikelyIPv6Literal(hostname: string): boolean {
  // URL.hostname returns IPv6 literals without brackets.
  return hostname.includes(':');
}

function isPrivateIPv6(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === '::' || h === '::1') return true;
  if (h.startsWith('fe80:')) return true; // link-local
  if (h.startsWith('fc') || h.startsWith('fd')) return true; // unique local (fc00::/7)

  // IPv4-mapped IPv6 addresses like ::ffff:127.0.0.1
  if (h.startsWith('::ffff:')) {
    const maybeV4 = h.slice('::ffff:'.length);
    return isPrivateIPv4(maybeV4);
  }

  return false;
}

export function isSafePublicHttpUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

  const hostname = url.hostname.toLowerCase();
  if (!hostname) return false;

  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) {
    return false;
  }

  if (hostname === '0.0.0.0') return false;

  if (isIPv4Literal(hostname)) {
    return !isPrivateIPv4(hostname);
  }

  if (isLikelyIPv6Literal(hostname)) {
    return !isPrivateIPv6(hostname);
  }

  return true;
}

