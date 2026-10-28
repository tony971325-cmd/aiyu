import { MENU, OPTS, SLOTS, json, sb } from "../../lib/shared.js";

export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); } catch { return json({ error: "資料格式錯誤" }, 400); }

  const name = String(b.name || "").trim().slice(0, 20);
  const phone = String(b.phone || "").trim();
  const memo = String(b.memo || "").trim().slice(0, 100);
  const date = String(b.date || "");
  const slot = String(b.slot || "");
  const cart = b.cart && typeof b.cart === "object" ? b.cart : {};

  if (!name || !/^09\d{8}$/.test(phone)) return json({ error: "姓名或手機格式不正確" }, 400);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !SLOTS.includes(slot)) return json({ error: "日期或時段不正確" }, 400);

  const today = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10); // 台灣時間
  const max = new Date(Date.now() + 8 * 3600e3 + 366 * 864e5).toISOString().slice(0, 10);
  const wd = new Date(date + "T12:00:00Z").getUTCDay();
  if (date < today || date > max) return json({ error: "日期不在可預約範圍" }, 400);
  if (wd !== 0 && wd !== 6) return json({ error: "僅開放週六、週日預約" }, 400);

  const items = [];
  let total = 0, cups = 0, sweet = 0, ice = 0;
  for (const [id, q] of Object.entries(cart)) {
    const n = Math.floor(Number(q));
    if (!n) continue;
    if (n < 0 || n > 20) return json({ error: "數量不正確" }, 400);
    if (MENU[id]) {
      const m = MENU[id];
      items.push({ id, name: m.name, qty: n, price: m.price, cups: m.cups });
      total += n * m.price; cups += n * m.cups;
    } else if (OPTS[id]) {
      items.push({ id, name: OPTS[id], qty: n, price: 0, opt: true });
      if (id === "ice") ice = n; else sweet += n;
    } else return json({ error: "品項不正確" }, 400);
  }
  if (!cups) return json({ error: "請至少選擇一項商品" }, 400);
  if (sweet !== cups) return json({ error: `甜度杯數（${sweet}）要和商品杯數（${cups}）一致` }, 400);
  if (ice > cups) return json({ error: "少冰杯數不能超過商品杯數" }, 400);

  const code = String(Math.floor(1000 + Math.random() * 9000));
  const r = await sb(env, "bookings", {
    method: "POST",
    body: JSON.stringify({ code, name, phone, memo, date, slot, items, total }),
  });
  if (!r.ok) return json({ error: "系統忙碌，請稍後再試" }, 500);
  return json({ code, total });
}
