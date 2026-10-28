// 品項與價格以伺服器為準，不信任瀏覽器傳來的金額
export const MENU = {
  lemon: { name: "原味招牌檸檬愛玉", price: 40, cups: 1 },
  b3: { name: "原味招牌檸檬愛玉 3 杯", price: 100, cups: 3 },
};
export const OPTS = { s1: "正常甜", s2: "半糖", s3: "微糖", ice: "冰塊（少冰）" };
export const SLOTS = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

export const json = (d, s = 200) =>
  new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });

export const sb = (env, path, init = {}) =>
  fetch(env.SUPABASE_URL + "/rest/v1/" + path, {
    ...init,
    headers: {
      apikey: env.SUPABASE_SERVICE_KEY,
      Authorization: "Bearer " + env.SUPABASE_SERVICE_KEY,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
  });
