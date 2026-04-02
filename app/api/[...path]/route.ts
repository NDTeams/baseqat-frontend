import { NextRequest, NextResponse } from 'next/server';
import http from 'http';
import { URL } from 'url';

export const runtime = 'nodejs';

const BACKEND = 'http://localhost:5139/api';

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

  // Fallback: if no Authorization header, try reading from cookie (for server-side requests)
  if (!headers['authorization']) {
    const accessToken = request.cookies.get('access_token')?.value
      || request.cookies.get('auth_token')?.value;
    if (accessToken) {
      headers['authorization'] = `Bearer ${accessToken}`;
    }
  }

  // Read body for non-GET/HEAD
  let body: Buffer | undefined;
  if (!['GET', 'HEAD'].includes(request.method)) {
    body = Buffer.from(await request.arrayBuffer());
    if (body.length > 0) {
      headers['content-length'] = String(body.length);
    }
  }

  try {
    const response = await makeRequest(target, request.method, headers, body);

    // Build response headers
    const responseHeaders = new Headers();
    const skipHeaders = ['transfer-encoding', 'connection', 'content-encoding', 'set-cookie'];
    for (const [key, value] of Object.entries(response.headers)) {
      if (value && !skipHeaders.includes(key.toLowerCase())) {
        responseHeaders.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    }

    return new NextResponse(response.body as unknown as BodyInit, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('[Proxy Error]', error.message);
    return NextResponse.json(
      { succeeded: false, message: 'Backend connection error: ' + error.message },
      { status: 502 }
    );
  }
}

function makeRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: Buffer
): Promise<{ status: number; headers: Record<string, string | string[]>; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);

    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method,
      headers,
    };

    const req = http.request(options, (res) => {
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
