# Mothership Companion · Pandora

Онлайн-компаньон для Mothership 1e. У каждого игрока свои листы в браузере (localStorage).

## Ссылки

- **Сайт (Cloudflare Pages):** https://pandora-companion.pages.dev/
- **Зеркало (GitHub Pages):** https://ammaranthus.github.io/pandora-companion/
- **Репозиторий:** https://github.com/Ammaranthus/pandora-companion

## Discord webhook

1. В Discord: настройки канала → Интеграции → Вебхуки → создать.
2. На сайте Companion нажать Webhook, вставить URL, включить «Пересылать броски».
3. URL хранится только в вашем браузере.

На Cloudflare (*.pages.dev) броски идут через прокси /api/discord.

## Обновления

1. Правите файлы в companion/
2. git add companion && git commit && git push origin main
3. cd companion && wrangler pages deploy . --project-name=pandora-companion --commit-dirty=true

Либо подключите git в Cloudflare Dashboard (root directory: companion) — тогда хватит push.
