/**
 * Cloudflare Pages Function: прокси Discord webhook (обход CORS в браузере).
 * POST JSON: { url, username?, embeds?, content? }
 * или multipart: url + payload_json + files[0]
 */

const WEBHOOK_RE = /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[\w-]+$/i;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context) {
  const { request } = context;
  const ct = request.headers.get("content-type") || "";

  try {
    if (ct.includes("multipart/form-data")) {
      const form = await request.formData();
      const url = String(form.get("url") || "").trim();
      if (!WEBHOOK_RE.test(url)) {
        return json(400, { error: "Invalid Discord webhook URL" });
      }
      const out = new FormData();
      const payload = form.get("payload_json");
      if (payload != null) out.append("payload_json", payload);
      const file = form.get("files[0]");
      if (file) out.append("files[0]", file, file.name || "avatar.jpg");
      const res = await fetch(url, { method: "POST", body: out });
      const text = await res.text();
      return new Response(text || null, {
        status: res.status,
        headers: { ...corsHeaders(), "Content-Type": res.headers.get("Content-Type") || "text/plain" },
      });
    }

    const body = await request.json();
    const url = String(body.url || "").trim();
    if (!WEBHOOK_RE.test(url)) {
      return json(400, { error: "Invalid Discord webhook URL" });
    }
    const payload = {
      username: body.username,
      content: body.content,
      embeds: body.embeds,
      avatar_url: body.avatar_url,
    };
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    return new Response(text || null, {
      status: res.status,
      headers: { ...corsHeaders(), "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });
  } catch (err) {
    return json(500, { error: String(err && err.message ? err.message : err) });
  }
}
