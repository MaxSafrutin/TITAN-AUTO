# Кабинет директора

Кабинет работает как Cloudflare Worker по отдельному HTTPS-адресу. Публичный сайт остаётся на GitHub Pages. Кабинет читает список из `team-seed.json` и запускает существующий процесс публикации `team.yml`.

1. Войдите в аккаунт Cloudflare и включите поддомен Workers. Из этой папки выполните `npx wrangler login`, затем `npx wrangler deploy`.
2. Создайте в GitHub fine-grained токен для одного репозитория `MaxSafrutin/TITAN-AUTO` с правами **Actions: Read and write** и **Contents: Read-only**. Введите его через `npx wrangler secret put GITHUB_ACTIONS_TOKEN`.
3. Создайте случайный пароль от 20 символов и введите его через `npx wrangler secret put DIRECTOR_PASSWORD`. Пароль и токен хранятся в секретах Cloudflare.
4. Проверьте, что адрес Worker запрашивает вход. Передайте директору этот адрес, логин `director` и пароль. Публичный сайт не содержит ссылки на кабинет.

Правки появляются после сборки GitHub Pages. Дождитесь появления изменения в списке перед следующей правкой. Срок действия токена задаётся в GitHub. При его замене обновите секрет `GITHUB_ACTIONS_TOKEN`.
