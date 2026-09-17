/**
 * Keepalive endpoint.
 *
 * Pointing an uptime monitor at the HOMEPAGE does NOT keep Supabase
 * warm — public pages are static assets served from Cloudflare's edge and
 * never touch Postgres. The monitor would report 100% uptime while the
 * database paused underneath it after 7 days.
 *
 * Point UptimeRobot at THIS path. Once Supabase is wired (Phase 9), the
 * query below runs for real and keeps the project awake.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, string> = { worker: 'ok' };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/?select=1`, {
        headers: { apikey: key, authorization: `Bearer ${key}` },
      });
      checks.database = res.ok ? 'ok' : `http_${res.status}`;
    } catch {
      checks.database = 'unreachable';
    }
  } else {
    checks.database = 'not_configured';
  }

  const healthy = Object.values(checks).every((v) => v === 'ok' || v === 'not_configured');

  return Response.json(
    { status: healthy ? 'ok' : 'degraded', checks, now: new Date().toISOString() },
    { status: healthy ? 200 : 503, headers: { 'cache-control': 'no-store' } }
  );
}
