import { createClient } from "npm:@supabase/supabase-js@2.110.5";

function getServiceKey() {
  const current = Deno.env.get("SUPABASE_SECRET_KEYS") ?? "";
  if (current) {
    try {
      const keys = JSON.parse(current) as Record<string, string>;
      if (keys.default) return keys.default;
      const first = Object.values(keys).find(Boolean);
      if (first) return first;
    } catch { /* legacy fallback */ }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const jsonHeaders = { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" };
function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: jsonHeaders });
}
function firstEnvironmentValue(...names: string[]): string {
  for (const name of names) {
    const value = Deno.env.get(name) ?? "";
    if (value) return value;
  }
  return "";
}
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i += 1) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);
  const cronSecret = firstEnvironmentValue("RCE_CRON_SECRET", "NIS_CRON_SECRET");
  const suppliedSecret = request.headers.get("x-cron-secret") ?? "";
  if (!cronSecret || !constantTimeEqual(suppliedSecret, cronSecret)) return jsonResponse({ error: "unauthorised" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = getServiceKey();
  if (!url || !serviceKey) return jsonResponse({ error: "service configuration unavailable" }, 500);

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: licenceSnapshot, error: snapshotError } = await supabase.rpc("license_snapshot_for_role", { target_role: "system_admin" });
  if (snapshotError) return jsonResponse({ error: `licence status check failed: ${snapshotError.message}` }, 500);
  if (licenceSnapshot?.write_allowed !== true) return jsonResponse({ processed: 0, failed: 0, disabled: true, reason: licenceSnapshot?.warning || "the current licence does not permit notification delivery" });
  const { data: featureEnabled, error: featureError } = await supabase.rpc("license_feature_enabled", { feature_code: "notifications" });
  if (featureError) return jsonResponse({ error: `licence feature check failed: ${featureError.message}` }, 500);
  if (featureEnabled !== true) return jsonResponse({ processed: 0, failed: 0, disabled: true, reason: "notifications feature is not included in the current licence" });

  const workerId = crypto.randomUUID();
  const { data: jobs, error } = await supabase.rpc("claim_notification_jobs", { target_batch_size: 50, target_worker_id: workerId });
  if (error) return jsonResponse({ error: error.message }, 500);

  const resendKey = Deno.env.get("RESEND_API_KEY") ?? "";
  const fromAddress = firstEnvironmentValue("RCE_EMAIL_FROM", "NIS_EMAIL_FROM");
  let processed = 0, failed = 0;
  for (const job of jobs ?? []) {
    try {
      if (job.channel !== "email" || !job.recipient_email) throw new Error("Unsupported or incomplete notification channel");
      if (!resendKey) throw new Error("Email provider unavailable");
      if (!fromAddress) throw new Error("Email sender is not configured");
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json", "Idempotency-Key": `edusentia-notification-${job.id}` },
        body: JSON.stringify({
          from: fromAddress,
          to: [job.recipient_email],
          subject: String(job.payload?.title ?? "Edusentia").replace(/[\r\n]+/g, " ").slice(0, 200),
          text: String(job.payload?.body ?? "").slice(0, 100000),
        }),
      });
      if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
      const { data: completed, error: completionError } = await supabase.rpc("complete_notification_job", { target_job_id: job.id, target_worker_id: workerId, target_success: true, target_error: "" });
      if (completionError || completed !== true) throw completionError ?? new Error("Notification lock ownership changed");
      processed += 1;
    } catch (jobError) {
      await supabase.rpc("complete_notification_job", { target_job_id: job.id, target_worker_id: workerId, target_success: false, target_error: jobError instanceof Error ? jobError.message : String(jobError) });
      failed += 1;
    }
  }
  return jsonResponse({ processed, failed, product: "Edusentia", release: "r37-product-ready" });
});
