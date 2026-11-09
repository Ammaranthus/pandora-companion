# Mothership Companion · Pandora

Онлайн-компаньон для Mothership 1e. У каждого игрока свои листы в браузере (`localStorage`).

## Ссылки

- **Репозиторий:** https://github.com/Ammaranthus/pandora-companion
- **Сайт (GitHub Pages):** https://ammaranthus.github.io/pandora-companion/

## Discord webhook

1. В Discord: настройки канала → Интеграции → Вебхуки → создать.
2. В Companion нажать **Webhook**, вставить URL, включить «Пересылать броски».
3. URL хранится только в вашем браузере.

## Обновления

Правки в `companion/` → commit → `git push origin main` → сайт обновится сам (GitHub Actions).

## Cloudflare Pages (опционально)

Чтобы поднять тот же проект на Cloudflare (с `/api/discord`):

1. [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create → Connect to Git
2. Репозиторий `Ammaranthus/pandora-companion`
3. Root directory: `companion`
4. Deploy

Либо локально: `wrangler login`, затем из папки `companion`:

```bash
wrangler pages deploy . --project-name=pandora-companion
```
