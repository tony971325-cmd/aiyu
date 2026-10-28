# 哎呦，來一杯～ 愛玉預約系統（Supabase + Cloudflare）

架構：瀏覽器 → Cloudflare Pages（網頁 + Functions）→ Supabase（資料庫）
Supabase 的金鑰只放在 Cloudflare 的環境變數，不會出現在網頁裡。

## 一、Supabase
1. supabase.com 建立專案。
2. SQL Editor 貼上 `supabase/schema.sql` 執行。
3. Project Settings → API：複製 **Project URL** 和 **service_role key**（絕對不要公開）。

## 二、Cloudflare Pages
在本資料夾（有 `functions` 的那層）執行：

    npm i -g wrangler
    wrangler login
    wrangler pages project create aiyu --production-branch main
    wrangler pages secret put SUPABASE_URL --project-name aiyu
    wrangler pages secret put SUPABASE_SERVICE_KEY --project-name aiyu
    wrangler pages secret put ADMIN_PASSWORD --project-name aiyu
    wrangler pages deploy public --project-name aiyu

（ADMIN_PASSWORD 是你自訂的店家後台密碼。設定完密碼後，請再執行一次最後一行重新部署。）

## 三、使用
- 客人：`https://aiyu.pages.dev`
- 店家後台：`https://aiyu.pages.dev/#admin`，點「訂單管理」，輸入密碼。

## 修改品項／價格
- 伺服器：`lib/shared.js`（價格以這裡為準）
- 網頁顯示：`public/index.html` 最上面的 `MENU`
兩邊要一起改，改完重新部署。
