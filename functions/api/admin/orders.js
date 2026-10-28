import { json, sb } from "../../../lib/shared.js";

const authed = (req, env) => env.ADMIN_PASSWORD && req.headers.get("x-admin-key") === env.ADMIN_PASSWORD;

export async function onRequestGet({ request, env }) {
  if (!authed(request, env)) return json({ error: "密碼錯誤" }, 401);
  const date = new URL(request.url).searchParams.get("date") || "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: "日期錯誤" }, 400);
  const r = await sb(env, `bookings?date=eq.${date}&order=slot.asc,created_at.asc`);
  return json(await r.json(), r.status);
}

export async function onRequestPatch({ request, env }) {
  if (!authed(request, env)) return json({ error: "密碼錯誤" }, 401);
  let b; try { b = await request.json(); } catch { return json({ error: "格式錯誤" }, 400); }
  if (!["new", "ok", "done", "cancel"].includes(b.status) || !/^[0-9a-f-]{36}$/.test(b.id || ""))
    return json({ error: "參數錯誤" }, 400);
  const r = await sb(env, `bookings?id=eq.${b.id}`, { method: "PATCH", body: JSON.stringify({ status: b.status }) });
  return json({ ok: r.ok }, r.ok ? 200 : 500);
}
