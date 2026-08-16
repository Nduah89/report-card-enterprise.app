import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin, Access-Control-Request-Headers",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" };
const upstreamUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/platform-package-manager`;

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  const authorization = req.headers.get("authorization") || "";
  const apikey = req.headers.get("apikey") || "";
  if (!authorization.toLowerCase().startsWith("bearer ") || !apikey) {
    return json(401, { ok: false, error: "Authenticated platform request required" });
  }

  let bodyText = "";
  try {
    bodyText = await req.text();
    if (!bodyText.trim()) return json(400, { ok: false, error: "Request body is required" });
    JSON.parse(bodyText);
  } catch {
    return json(400, { ok: false, error: "Request body must be valid JSON" });
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Authorization": authorization,
        "apikey": apikey,
        "Content-Type": "application/json",
        "x-client-info": req.headers.get("x-client-info") || "edusentia-platform-package-gateway/1",
      },
      body: bodyText,
      redirect: "error",
    });

    const responseHeaders = new Headers(corsHeaders);
    responseHeaders.set("Content-Type", upstream.headers.get("content-type") || "application/json; charset=utf-8");
    responseHeaders.set("Cache-Control", "no-store");
    responseHeaders.set("X-Edusentia-Package-Gateway", "1");
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    console.error("platform-package-gateway upstream failure", error instanceof Error ? error.message : String(error));
    return json(502, { ok: false, error: "Platform package service is temporarily unavailable" });
  }
});
