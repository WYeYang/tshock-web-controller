/**
 * TShock API Proxy — Node Function
 *
 * Forwards /api/* requests to the real TShock server address
 * specified in the X-TShock-Url request header.
 *
 * Security features:
 * - Origin validation (allow *.edgeone.cool, localhost, 127.0.0.1)
 * - IP-based sliding window rate limiting (60 req/min per IP)
 * - Structured JSON logging for all stages
 * - Restricted CORS (reflect validated Origin only)
 */

// ---------------------------------------------------------------------------
// Structured Logger
// ---------------------------------------------------------------------------

interface LogData {
  [key: string]: unknown;
}

function log(level: string, message: string, requestId: string, data: LogData = {}): void {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    requestId,
    level,
    message,
    ...data,
  }));
}

// ---------------------------------------------------------------------------
// Request ID Generator
// ---------------------------------------------------------------------------

function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// Origin Validation
// ---------------------------------------------------------------------------

const ALLOWED_ORIGIN_PATTERNS: RegExp[] = [
  /^https?:\/\/([a-zA-Z0-9-]+\.)*edgeone\.cool(:\d+)?$/,
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
];

function validateOrigin(origin: string | null): { valid: boolean; origin: string } {
  if (!origin) {
    // No Origin header — allow through (server-to-server / curl) but don't reflect it
    return { valid: true, origin: '' };
  }
  for (const pattern of ALLOWED_ORIGIN_PATTERNS) {
    if (pattern.test(origin)) {
      return { valid: true, origin };
    }
  }
  return { valid: false, origin };
}

// ---------------------------------------------------------------------------
// Sliding Window Rate Limiter
// ---------------------------------------------------------------------------

interface RateEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateEntry>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60;
const CLEANUP_INTERVAL_MS = 120_000; // cleanup every 2 minutes

// Periodic cleanup to prevent memory leaks
let lastCleanup = Date.now();

function cleanupExpiredEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }
  lastCleanup = now;

  for (const [ip, entry] of rateLimitMap) {
    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    // Remove entry entirely if empty
    if (entry.timestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  }
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  cleanupExpiredEntries();

  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  let entry = rateLimitMap.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitMap.set(ip, entry);
  }

  // Filter out timestamps outside the sliding window
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  if (entry.timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldestInWindow = entry.timestamps[0];
    const resetAt = oldestInWindow + RATE_LIMIT_WINDOW_MS;
    return { allowed: false, remaining: 0, resetAt };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - entry.timestamps.length,
    resetAt: now + RATE_LIMIT_WINDOW_MS,
  };
}

// ---------------------------------------------------------------------------
// Helper: extract client IP from request
// ---------------------------------------------------------------------------

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'unknown';
}

// ---------------------------------------------------------------------------
// CORS helper
// ---------------------------------------------------------------------------

function buildCorsHeaders(validatedOrigin: string): Record<string, string> {
  const allowOrigin = validatedOrigin || '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type, X-TShock-Url, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function corsResponse(
  status: number,
  body: string,
  corsHeaders: Record<string, string>,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

// ---------------------------------------------------------------------------
// Main Handler
// ---------------------------------------------------------------------------

export async function onRequest(context: any): Promise<Response> {
  const { request } = context;
  const requestId = generateRequestId();

  const clientIp = getClientIp(request);
  const origin = request.headers.get('Origin');
  const incomingUrl = new URL(request.url);
  const method = request.method;
  const path = incomingUrl.pathname + incomingUrl.search;

  // ── Log: request entry ────────────────────────────────────────────────
  log('info', 'Request received', requestId, {
    data: { method, path, clientIp, origin: origin || null },
  });

  // ── Origin validation ──────────────────────────────────────────────────
  const originResult = validateOrigin(origin);

  if (!originResult.valid) {
    log('warn', 'Origin validation rejected', requestId, {
      data: { origin, clientIp },
    });
    return corsResponse(
      403,
      JSON.stringify({
        status: 'error',
        error: 'Forbidden: request origin is not allowed.',
      }),
      buildCorsHeaders(''),
    );
  }

  log('info', 'Origin validation passed', requestId, {
    data: { origin: originResult.origin || '(none)' },
  });

  const corsHeaders = buildCorsHeaders(originResult.origin);

  // ── Handle CORS preflight (after origin check) ─────────────────────────
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // ── Rate limiting ──────────────────────────────────────────────────────
  const rateResult = checkRateLimit(clientIp);

  if (!rateResult.allowed) {
    log('warn', 'Rate limit exceeded', requestId, {
      data: { clientIp, resetAt: new Date(rateResult.resetAt).toISOString() },
    });
    return corsResponse(
      429,
      JSON.stringify({
        status: 'error',
        error: 'Too many requests. Please try again later.',
      }),
      corsHeaders,
      { 'Retry-After': String(Math.ceil((rateResult.resetAt - Date.now()) / 1000)) },
    );
  }

  log('info', 'Rate limit passed', requestId, {
    data: { clientIp, remaining: rateResult.remaining },
  });

  // ── Read target TShock URL ─────────────────────────────────────────────
  const tshockUrl = request.headers.get('X-TShock-Url');
  if (!tshockUrl) {
    return corsResponse(
      400,
      JSON.stringify({
        status: 'error',
        error: 'Missing X-TShock-Url header. Provide the TShock server address (e.g. http://localhost:7878).',
      }),
      corsHeaders,
    );
  }

  // ── Validate URL format ───────────────────────────────────────────────
  let baseUrl: string;
  try {
    const parsed = new URL(tshockUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    baseUrl = parsed.origin;
  } catch {
    return corsResponse(
      400,
      JSON.stringify({
        status: 'error',
        error: `Invalid X-TShock-Url header value: "${tshockUrl}". Must be a valid HTTP(S) URL.`,
      }),
      corsHeaders,
    );
  }

  // ── Build target URL ───────────────────────────────────────────────────
  const forwardPath = incomingUrl.pathname.replace(/^\/api\/?/, '/') + incomingUrl.search;
  const targetUrl = `${baseUrl}${forwardPath}`;

  log('info', 'Forwarding request', requestId, {
    data: { targetUrl, forwardPath, baseUrl },
  });

  // ── Clone and clean headers ────────────────────────────────────────────
  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.delete('X-TShock-Url');
  forwardHeaders.delete('host');

  // ── Proxy request ──────────────────────────────────────────────────────
  const startTime = Date.now();

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body: method !== 'GET' && method !== 'HEAD' ? request.body : undefined,
      redirect: 'follow',
    });

    const elapsed = Date.now() - startTime;

    // Build the response with CORS headers
    const responseHeaders = new Headers(response.headers);
    for (const [key, value] of Object.entries(corsHeaders)) {
      responseHeaders.set(key, value);
    }

    // Clone body to measure size for logging
    const bodyBuffer = await response.arrayBuffer();
    const responseSize = bodyBuffer.byteLength;

    log('info', 'Response sent', requestId, {
      data: {
        status: response.status,
        responseSize,
        elapsed,
      },
    });

    return new Response(bodyBuffer, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    const message = error?.message || 'Unknown error';

    log('error', 'Proxy request failed', requestId, {
      data: {
        error: message,
        targetUrl: baseUrl,
        elapsed,
      },
    });

    return corsResponse(
      502,
      JSON.stringify({
        status: 'error',
        error: `Failed to connect to TShock server at ${baseUrl}: ${message}`,
      }),
      corsHeaders,
    );
  }
}
