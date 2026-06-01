/**
 * TShock API Proxy — Node Function
 *
 * Forwards /api/* requests to the real TShock server address
 * specified in the X-TShock-Url request header.
 *
 * - Strips the /api prefix before forwarding
 * - Supports all HTTP methods
 * - Adds CORS headers
 * - Returns meaningful error responses on failure
 */

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, X-TShock-Url, Authorization',
  'Access-Control-Max-Age': '86400',
};

function corsResponse(status: number, body: string, extraHeaders: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

export async function onRequest(context: any): Promise<Response> {
  const { request } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // Read the target TShock server URL from the custom header
  const tshockUrl = request.headers.get('X-TShock-Url');
  if (!tshockUrl) {
    return corsResponse(400, JSON.stringify({
      status: 'error',
      error: 'Missing X-TShock-Url header. Provide the TShock server address (e.g. http://localhost:7878).',
    }));
  }

  // Validate the URL format
  let baseUrl: string;
  try {
    const parsed = new URL(tshockUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    baseUrl = parsed.origin;
  } catch {
    return corsResponse(400, JSON.stringify({
      status: 'error',
      error: `Invalid X-TShock-Url header value: "${tshockUrl}". Must be a valid HTTP(S) URL.`,
    }));
  }

  // Build the target URL by stripping /api prefix from the pathname
  const incomingUrl = new URL(request.url);
  const forwardPath = incomingUrl.pathname.replace(/^\/api\/?/, '/') + incomingUrl.search;
  const targetUrl = `${baseUrl}${forwardPath}`;

  // Clone headers, remove the proxy-specific header before forwarding
  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.delete('X-TShock-Url');
  // Remove host header to avoid confusion at the target server
  forwardHeaders.delete('host');

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'follow',
    });

    // Build the response with CORS headers
    const responseHeaders = new Headers(response.headers);
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      responseHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    const message = error?.message || 'Unknown error';
    return corsResponse(502, JSON.stringify({
      status: 'error',
      error: `Failed to connect to TShock server at ${baseUrl}: ${message}`,
    }));
  }
}
