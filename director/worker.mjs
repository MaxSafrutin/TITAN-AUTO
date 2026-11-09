const repository = 'https://api.github.com/repos/MaxSafrutin/TITAN-AUTO';
const workflow = '/actions/workflows/team.yml';
const fields = {
  name: 'Имя и фамилия', role: 'Должность', bio: 'Описание для сайта',
  photo: 'Ссылка на фото', phone: 'Телефон', telegram: 'Ссылка Telegram',
  channel: 'Ссылка на канал Telegram', max: 'Ссылка MAX', email: 'Электронная почта',
};
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const escape = value => String(value ?? '').replace(/[&<>"']/g, c =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

function page(content, status = 200, headers = {}) {
  return new Response('<!doctype html><html lang="ru"><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Команда · Титан Авто</title><style>' +
    'body{margin:0;background:#111;color:#f5f5f5;font:16px/1.5 system-ui}main{max-width:660px;margin:auto;padding:24px}' +
    'h1{line-height:1.2}a{color:#ffb4aa}article,form{padding:16px;background:#222;border-radius:12px;margin:12px 0}' +
    'label{display:grid;gap:5px;margin-bottom:14px}input,textarea,button{font:inherit;padding:10px;border-radius:7px;border:1px solid #777}' +
    'textarea{min-height:90px}.button,button{display:inline-block;background:#a52925;color:white;padding:10px 15px;border-radius:7px;text-decoration:none;cursor:pointer}' +
    'nav{display:flex;gap:16px;flex-wrap:wrap}.muted{color:#ccc}</style><main>' + content + '</main></html>', {
      status, headers: {
        'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
        'Referrer-Policy': 'same-origin', ...headers,
      },
    });
}

const back = '<p><a href="/">← К списку команды</a></p>';
function list(team) {
  return page('<h1>Команда Титан Авто</h1><p>Занято ' + team.length + ' из 10 мест</p>' +
    (team.length < 10 ? '<p><a class="button" href="/add">Добавить сотрудника</a></p>' : '') +
    team.map(member => '<article><strong>' + escape(member.name) + '</strong><div class="muted">' +
      escape(member.role) + '</div><nav><a href="/edit/' + escape(member.slug) +
      '">Редактировать</a><a href="/delete/' + escape(member.slug) + '">Удалить</a></nav></article>').join(''));
}

function form(member, action) {
  const url = member ? '/' + action + '/' + escape(member.slug) : '/add';
  if (action === 'delete') {
    return page(back + '<h1>Удалить сотрудника?</h1><p>' + escape(member.name) +
      ' исчезнет из команды, а ссылка на визитку перестанет открываться.</p><form method="post" action="' +
      url + '"><button>Удалить сотрудника</button></form>');
  }
  const controls = Object.entries(fields).map(([name, label]) => {
    const value = escape(member?.[name]);
    const required = ['name', 'role'].includes(name) ? ' required' : '';
    const limit = {name:100, role:150}[name] || 1000;
    return '<label>' + label + (name === 'bio'
      ? '<textarea name="bio" maxlength="1000">' + value + '</textarea>'
      : '<input name="' + name + '" value="' + value + '" maxlength="' + limit + '"' + required + '>') + '</label>';
  }).join('');
  return page(back + '<h1>' + (member ? 'Редактировать сотрудника' : 'Добавить сотрудника') +
    '</h1><p>Если телефон пустой, сотрудник появится только в разделе «Команда».</p>' +
    '<form method="post" action="' + url + '">' + controls + '<button>Сохранить</button></form>');
}

async function authorized(request, password) {
  const match = /^Basic ([A-Za-z0-9+/=]+)$/i.exec(request.headers.get('Authorization') || '');
  if (!match) return false;
  try {
    const supplied = Uint8Array.from(atob(match[1]), c => c.charCodeAt(0));
    const expected = new TextEncoder().encode('director:' + password);
    const [a, b] = await Promise.all([supplied, expected].map(async input =>
      new Uint8Array(await crypto.subtle.digest('SHA-256', input))));
    return a.reduce((diff, byte, i) => diff | (byte ^ b[i]), 0) === 0;
  } catch { return false; }
}

async function github(env, path, init = {}) {
  const response = await fetch(repository + path, {
    ...init, headers: {
      'Authorization': 'Bearer ' + env.GITHUB_ACTIONS_TOKEN,
      'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2026-03-10',
      'User-Agent': 'Titan-Auto-Director',
      ...init.headers,
    },
  });
  if (!response.ok) throw Error('GitHub API: ' + response.status);
  return response;
}

async function loadTeam(env) {
  const response = await github(env, '/contents/team-seed.json?ref=main', {
    headers: {'Accept':'application/vnd.github.raw+json', 'Cache-Control':'no-cache'},
  });
  return response.json();
}

async function publication(env, id) {
  const response = await github(env, '/actions/runs/' + id);
  const run = await response.json();
  if (run.path !== '.github/workflows/team.yml') return page(back + '<h1>Публикация не найдена</h1>', 404);
  if (run.status !== 'completed') {
    return page('<meta http-equiv="refresh" content="5"><h1>Правка публикуется</h1><p>Эта страница обновится автоматически.</p>');
  }
  if (run.conclusion !== 'success') {
    return page('<h1>Публикация не завершилась</h1><p>Номер запуска: ' + id +
      '. Сообщите его тому, кто обслуживает сайт.</p>' + back, 502);
  }
  return page('<h1>Изменения опубликованы</h1>' + back);
}

function newSlug(name, team) {
  const letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
  const roman = 'a b v g d e yo zh z i y k l m n o p r s t u f kh ts ch sh shch - y - e yu ya'.split(' ');
  const base = Array.from(name.toLowerCase(), char => roman[letters.indexOf(char)] ?? char).join('')
    .replace(/[^a-z0-9]+/g, '-').slice(0, 50).replace(/^-|-$/g, '') || 'manager';
  let slug = base;
  for (let number = 2; ['assets','maksim-safrutin'].includes(slug) || team.some(m => m.slug === slug); number++) {
    slug = base + '-' + number;
  }
  return slug;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!env.DIRECTOR_PASSWORD || env.DIRECTOR_PASSWORD.length < 20 || !env.GITHUB_ACTIONS_TOKEN) {
      return page('<h1>Кабинет ещё не настроен</h1>', 503);
    }
    if (!await authorized(request, env.DIRECTOR_PASSWORD)) {
      return page('<h1>Вход для директора</h1>', 401, {'WWW-Authenticate':'Basic realm="Titan Auto", charset="UTF-8"'});
    }
    const statusRoute = /^\/publication\/([0-9]+)$/.exec(url.pathname);
    if (request.method === 'GET' && statusRoute) {
      try { return await publication(env, statusRoute[1]); }
      catch { return page('<h1>Не удалось проверить публикацию</h1><p>Номер запуска: ' + statusRoute[1] + '.</p>' + back, 502); }
    }
    const route = /^\/(edit|delete)\/([a-z0-9-]+)$/.exec(url.pathname);
    const action = route?.[1] || (url.pathname === '/add' ? 'add' : '');
    if (url.pathname !== '/' && !action) return page(back + '<h1>Страница не найдена</h1>', 404);
    if (!['GET','POST'].includes(request.method) || (request.method === 'POST' && !action)) {
      return page(back + '<h1>Действие недоступно</h1>', 405);
    }
    if (request.method === 'POST' && request.headers.get('Origin') !== url.origin) {
      return page(back + '<h1>Откройте форму заново</h1>', 403);
    }
    try {
      const team = await loadTeam(env);
      if (!action) return list(team);
      const member = route && team.find(item => item.slug === route[2]);
      if (route && !member) return page(back + '<h1>Сотрудник не найден</h1>', 404);
      if (action === 'add' && team.length >= 10) return page(back + '<h1>Все 10 мест заняты</h1>', 409);
      if (request.method === 'GET') return form(member, action);

      if (!request.headers.get('Content-Type')?.startsWith('application/x-www-form-urlencoded') ||
          Number(request.headers.get('Content-Length')) > 16000) {
        return page(back + '<h1>Не удалось прочитать форму</h1>', 400);
      }
      const body = await request.text();
      if (body.length > 16000) return page(back + '<h1>Форма слишком большая</h1>', 413);
      const values = new URLSearchParams(body);
      const inputs = {action, slug: member?.slug || ''};
      if (action !== 'delete') {
        for (const key of Object.keys(fields)) {
          const value = (values.get(key) || '').trim();
          inputs[key] = value || (action === 'edit' && member[key] ? '-' : '');
        }
        if (!inputs.name || !inputs.role || inputs.name === '-' || inputs.role === '-') {
          return page(back + '<h1>Укажите имя и должность</h1>', 400);
        }
        if (inputs.phone && inputs.phone !== '-' && !/^\+[1-9]\d{6,14}$/.test(inputs.phone.replace(/[\s()-]/g,''))) {
          return page(back + '<h1>Проверьте телефон</h1><p>Введите номер с кодом страны, например +7 900 123-45-67.</p>', 400);
        }
        if (action === 'add') inputs.slug = newSlug(inputs.name, team);
      }
      if (!slugPattern.test(inputs.slug)) return page(back + '<h1>Некорректный адрес визитки</h1>', 400);
      const response = await github(env, workflow + '/dispatches', {
        method: 'POST', body: JSON.stringify({ref:'main', inputs}),
      });
      const result = await response.json();
      if (!Number.isSafeInteger(result.workflow_run_id) || result.workflow_run_id < 1) {
        throw Error('GitHub did not return a workflow run ID');
      }
      return new Response(null, {
        status: 303,
        headers: {Location: '/publication/' + result.workflow_run_id, 'Cache-Control': 'no-store'},
      });
    } catch (error) {
      console.error(error.message);
      return page(back + '<h1>Сервис временно недоступен</h1><p>Попробуйте ещё раз чуть позже.</p>', 502);
    }
  },
};
