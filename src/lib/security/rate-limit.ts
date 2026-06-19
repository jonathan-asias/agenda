import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanupExpired(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

function getClientKey(request: NextRequest, bucket: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
  return `${bucket}:${ip}`;
}

export interface RateLimitOptions {
  /** Ventana en segundos */
  windowSec?: number;
  /** Máximo de peticiones por ventana */
  max?: number;
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterSec?: number;
}

/**
 * Rate limit en memoria (por IP + bucket).
 * En producción multi-instancia considerar Redis/Upstash.
 */
export function checkRateLimit(
  request: NextRequest,
  bucket: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowSec = options.windowSec ?? 60;
  const max = options.max ?? 20;

  cleanupExpired();

  const key = getClientKey(request, bucket);
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { ok: true };
  }

  if (entry.count >= max) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { ok: true };
}

export function rateLimitResponse(retryAfterSec: number): NextResponse {
  return NextResponse.json(
    { error: 'Demasiadas solicitudes. Intente más tarde.' },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSec) },
    }
  );
}
