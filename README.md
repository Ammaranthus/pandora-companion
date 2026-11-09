# Pandora Companion (Mothership 1e)

Онлайн-компаньон мастера: листы, кубы, паника, Discord webhook.

**Репозиторий:** https://github.com/Ammaranthus/pandora-companion

## Ссылка для игроков

После деплоя откройте сайт (GitHub Pages или Cloudflare Pages) и сохраните закладку.  
У каждого свои листы в браузере (`localStorage`).

## Discord webhook

1. В Discord: настройки канала → Интеграции → Вебхуки → создать → скопировать URL.
2. В Companion: кнопка **Webhook** → вставить URL → включить пересылку → **Тест**.
3. На **Cloudflare Pages** броски идут через `/api/discord` (обход CORS).
4. На чистом **GitHub Pages** прокси нет — Discord с https-сайта может не работать, пока не подключите Cloudflare (см. ниже).

## Подключить Cloudflare Pages (нужно для Discord)

1. Войти на https://dash.cloudflare.com  
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**  
3. Выбрать репозиторий `Ammaranthus/pandora-companion`  
4. Настройки сборки:
   - Framework preset: **None**
   - Build command: *(пусто)*
   - Build output directory: `companion`
5. Save and Deploy  
6. Готовый URL вида `https://pandora-companion.pages.dev` — его и раздавайте.

Либо один раз: `wrangler login` → из корня репо  
`wrangler pages deploy companion --project-name=pandora-companion`

Секреты для GitHub Actions (опционально, автодеплой):  
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` в Settings → Secrets.

## Как обновлять (Anton)

1. Правите файлы в `companion/`  
2. `git add` → `git commit` → `git push origin main`  
3. Cloudflare/Pages подтянет изменения сам (если подключён Git) или снова `wrangler pages deploy companion --project-name=pandora-companion`

## Локально

Откройте `companion/index.html` или `companion/Запустить companion.bat`.  
Локально Discord шлётся напрямую на webhook (без прокси).
