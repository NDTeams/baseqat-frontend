import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import http from 'http';
import { URL } from 'url';

export const runtime = 'nodejs';

const BACKEND = 'http://localhost:5139/api';

const agent = new https.Agent({ rejectUnauthorized: false });

async function proxyHandler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = `${BACKEND}/${path.join('/')}${request.nextUrl.search}`;

  // Forward headers (exclude hop-by-hop)
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    const skip = ['host', 'connection', 'transfer-encoding'];
    if (!skip.includes(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  // If no Authorization header, try to read token from cookies
  // Priority: access_token (new HttpOnly) > auth_token (legacy js-cookie)
  if (!headers['authorization']) {
    const accessToken = request.cookies.get('access_token')?.value
      || request.cookies.get('auth_token')?.value;
    if (accessToken) {
      headers['authorization'] = `Bearer ${accessToken}`;
      console.log(`[Proxy] Added Bearer token from cookie (${accessToken.substring(0, 20)}...)`);
    } else {
      console.log(`[Proxy] No auth cookie found for ${path.join('/')}`);
    }
  }

  // Read body for non-GET/HEAD
  let body: Buffer | undefined;
  if (!['GET', 'HEAD'].includes(request.method)) {
    body = Buffer.from(await request.arrayBuffer());
    // Recalculate content-length to match actual buffer size
    if (body.length > 0) {
      headers['content-length'] = String(body.length);
    }
  }

  try {
    const response = await makeRequest(target, request.method, headers, body);

    // Build response headers WITHOUT set-cookie (handled separately)
    const responseHeaders = new Headers();
    const skipHeaders = ['transfer-encoding', 'connection', 'content-encoding', 'set-cookie'];
    for (const [key, value] of Object.entries(response.headers)) {
      if (value && !skipHeaders.includes(key.toLowerCase())) {
        responseHeaders.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    }

    // Create response first
    const nextResponse = new NextResponse(response.body as unknown as BodyInit, {
      status: response.status,
      headers: responseHeaders,
    });

    // Forward Set-Cookie headers using NextResponse.cookies.set() for reliability
    const setCookieHeaders = response.headers['set-cookie'];
    if (setCookieHeaders) {
      const cookieList = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
      for (const cookieStr of cookieList) {
        const parsed = parseSetCookie(cookieStr);
        if (parsed) {
          nextResponse.cookies.set(parsed.name, parsed.value, parsed.options);
        }
      }
    }

    // Robust fallback: For login/refresh endpoints, explicitly extract tokens from
    // response body and set cookies. This ensures cookies are set even if Set-Cookie
    // header forwarding fails.
    const pathLower = path.join('/').toLowerCase();
    if (
      response.status >= 200 && response.status < 300 &&
      (pathLower.includes('account/loginbyemail') || pathLower.includes('account/refreshtoken'))
    ) {
      try {
        const bodyStr = response.body.toString('utf-8');
        const bodyJson = JSON.parse(bodyStr);
        if (bodyJson.succeeded && bodyJson.data) {
          const token = bodyJson.data.token;
          const refreshTokenVal = bodyJson.data.refreshToken;
          const expiresOn = bodyJson.data.expiresOn;
          const refreshExpires = bodyJson.data.refreshTokenExpiration;

          if (token) {
            nextResponse.cookies.set('access_token', token, {
              httpOnly: true,
              secure: false,
              sameSite: 'lax',
              path: '/',
              ...(expiresOn ? { expires: new Date(expiresOn) } : {}),
            });
            console.log('[Proxy] Set access_token cookie from response body');
          }

          if (refreshTokenVal) {
            nextResponse.cookies.set('refresh_token', refreshTokenVal, {
              httpOnly: true,
              secure: false,
              sameSite: 'lax',
              path: '/',
              ...(refreshExpires ? { expires: new Date(refreshExpires) } : {}),
            });
            console.log('[Proxy] Set refresh_token cookie from response body');
          }
        }
      } catch {
        // Not JSON or parse failed - ignore
      }
    }

    // For logout, explicitly clear all auth cookies
    if (pathLower.includes('account/logout')) {
      nextResponse.cookies.delete('access_token');
      nextResponse.cookies.delete('refresh_token');
      nextResponse.cookies.delete('auth_token');
      console.log('[Proxy] Cleared auth cookies on logout');
    }

    return nextResponse;
  } catch (error: any) {
    console.error('[Proxy Error]', error.message);
    return NextResponse.json(
      { succeeded: false, message: 'Backend connection error: ' + error.message },
      { status: 502 }
    );
  }
}

// Parse a raw Set-Cookie string into name, value, and options
function parseSetCookie(cookieStr: string) {
  const parts = cookieStr.split(';').map(p => p.trim());
  if (parts.length === 0) return null;

  const firstPart = parts[0];
  const eqIdx = firstPart.indexOf('=');
  if (eqIdx < 0) return null;

  const name = firstPart.substring(0, eqIdx);
  const value = firstPart.substring(eqIdx + 1);

  const options: {
    httpOnly?: boolean;
    secure?: boolean;
    path?: string;
    expires?: Date;
    sameSite?: 'lax' | 'strict' | 'none';
    maxAge?: number;
  } = {};

  for (let i = 1; i < parts.length; i++) {
    const attr = parts[i];
    const attrEq = attr.indexOf('=');
    const attrName = (attrEq >= 0 ? attr.substring(0, attrEq) : attr).toLowerCase().trim();
    const attrValue = attrEq >= 0 ? attr.substring(attrEq + 1).trim() : '';

    switch (attrName) {
      case 'httponly': options.httpOnly = true; break;
      case 'secure': options.secure = true; break;
      case 'path': options.path = attrValue; break;
      case 'expires': options.expires = new Date(attrValue); break;
      case 'max-age': options.maxAge = parseInt(attrValue); break;
      case 'samesite':
        options.sameSite = attrValue.toLowerCase() as 'lax' | 'strict' | 'none';
        break;
    }
  }

  return { name, value, options };
}

function makeRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: Buffer
): Promise<{ status: number; headers: Record<string, string | string[]>; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';

    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method,
      headers,
      ...(isHttps ? { agent } : {}),
    };

    const lib = isHttps ? https : http;
    const req = lib.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode || 500,
          headers: res.headers as Record<string, string | string[]>,
          body: Buffer.concat(chunks),
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const DELETE = proxyHandler;
export const PATCH = proxyHandler;
