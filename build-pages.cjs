'use strict';
const fs = require('node:fs');
const path = require('node:path');
const teamFile = 'team-seed.json';
let team = JSON.parse(fs.readFileSync(teamFile, 'utf8'));
const legacy = 'maksim-safrutin';
const fallback = 'managers/assets/titan-avatar.jpg';
const read = file => fs.readFileSync(file, 'utf8');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const fields = {name:'Имя и фамилия',role:'Должность',bio:'Описание для раздела «Команда»',photo:'Фото: ссылка HTTPS или путь к файлу сайта',phone:'Телефон (если нужна визитка)',telegram:'Telegram',channel:'Канал Telegram',max:'MAX',email:'Электронная почта'};
const base = '/TITAN-AUTO';
const photo = m => /^https:\/\//.test(m.photo) ? m.photo : base + '/' + (m.photo || fallback);
const href = m => base + '/managers/' + m.slug + '/';
const format = p => p.replace(/^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
const originalCards = require('./original-card-data.json');

function originalCardFile(member, file) {
  const original = originalCards.find(card => card.slug === member.slug);
  if (!original) return null;
  const unchangedFields = ['name', 'role', 'photo', 'telegram', 'channel', 'max', 'email'];
  if (!unchangedFields.every(key => (original[key] || '') === (member[key] || ''))) return null;
  return read('managers/' + member.slug + '/' + file)
    .replaceAll(original.phone, member.phone)
    .replaceAll(format(original.phone), format(member.phone));
}
const list = () => team.filter(m => m.phone).sort((a,b) => a.name.split(' ').at(-1).localeCompare(b.name.split(' ').at(-1), 'ru'));
const splice = (html, name, content) => html.replace(new RegExp('<!-- '+name+':START -->[\\s\\S]*?<!-- '+name+':END -->'), () => content);
function landing() {
  return splice(read('index.html'), 'TEAM', team.map(m =>
    '<article class="compact-team-card"><img src="'+esc(photo(m))+'" alt="" width="320" height="320" loading="lazy"'+(!m.photo?' class="brand-photo"':'')+'><div class="compact-team-body"><span class="team-role">'+esc(m.role)+'</span><h3>'+esc(m.name)+'</h3><p>'+esc(m.bio)+'</p>'+(m.phone?'<a class="site-button" href="'+href(m)+'">Открыть визитку ↗</a>':'')+'</div></article>'
  ).join('') || '<p>Состав команды обновляется.</p>');
}
function directory() {
  return splice(read('managers/index.html'), 'DIRECTORY', list().map(m =>
    '<a class="manager-tile" href="'+href(m)+'"><img src="'+esc(photo(m))+'" alt="" width="96" height="96"><h2>'+esc(m.name)+'</h2><p>'+esc(m.role)+'</p><strong>'+format(m.phone)+'</strong><span class="tile-link">Открыть визитку ↗</span></a>'
  ).join('') || '<p>Список менеджеров обновляется.</p>');
}
function picker() {
  const items = list().map(m => ({slug:m.slug,name:m.name,phone:m.phone,display:format(m.phone),photo:photo(m)}));
  return read('assets/site-common.js').replace(/\/\* PICKER:START \*\/[\s\S]*?\/\* PICKER:END \*\//, () => JSON.stringify(items));
}
function quickLink(url, label, icon) {
  if (!url) return '';
  return '<a class="contactQuick" href="'+esc(url)+'" aria-label="'+label+'" title="'+label+
    '" data-tooltip="'+label+'"><img src="../assets/'+icon+'" alt="" width="29" height="29"></a>';
}

function phoneMethod(phone, label, links) {
  return '<div class="contactMethod"><div class="contactMethod__main"><a class="contactMethod__number" href="tel:'+
    phone+'">'+format(phone)+'</a><span class="contactMethod__label">'+label+
    '</span></div><div class="contactMethod__actions">'+links+'</div></div>';
}

function contactMethods(m) {
  const direct = quickLink('tel:'+m.phone, 'Позвонить', 'phone-logo.svg')+
    quickLink(m.telegram, 'Telegram', 'telegram-logo.svg')+quickLink(m.max, 'MAX', 'logo_max.svg');
  const extra = [[m.channel,'Канал Telegram'],[m.email && 'mailto:'+m.email,'Электронная почта']]
    .filter(([url])=>url).map(([url,label])=>'<div class="contactMethod"><a class="contactMethod__number" href="'+
      esc(url)+'">'+label+'</a></div>').join('');
  const hotline = '+79277097900';
  return phoneMethod(m.phone, 'Рабочий', direct)+
    '<details class="contactAccordion"><summary><span>Ещё контакты</span><span class="contactAccordion__chevron" aria-hidden="true">⌄</span></summary>'+
    '<div class="contactAccordion__body">'+extra+
    phoneMethod(hotline, 'Горячая линия', quickLink('tel:'+hotline, 'Позвонить', 'phone-logo.svg'))+'</div></details>';
}

function card(m) {
  const original = originalCardFile(m, 'index.html');
  if (original) return original;
  const template = read('managers/aleksandr-belyaev/index.html');
  const actions = template.match(/<div class="contactTopActions">[\s\S]*?(?=<div class="contactMethod">)/)[0].replace('aleksandr-belyaev.vcf',m.slug+'.vcf');
  const tail = template.slice(template.indexOf('<div class="modalActions contactMaterials">'));
  const head = '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>'+esc(m.name)+' — ТИТАН АВТО</title><meta property="og:title" content="'+esc(m.name)+' — ТИТАН АВТО">'+
    '<meta property="og:image" content="'+esc(new URL(photo(m), 'https://maxsafrutin.github.io').href)+'">'+
    '<meta name="description" content="'+esc(m.role)+'"><link rel="icon" href="../../assets/brand/favicon.svg">'+
    '<link rel="stylesheet" href="../assets/cards.css"><link rel="stylesheet" href="../../assets/site-common.css">'+
    '<script src="../../assets/site-common.js" defer></script></head>';
  const hero = '<div class="contactHead"><div class="contactHero"><img class="contactAvatar" src="'+esc(photo(m))+
    '" alt="" width="96" height="96"><div class="contactHero__content"><h1 class="contactName">'+esc(m.name)+
    '</h1><p class="contactRole">'+esc(m.role)+'</p><a class="contactCompany contactCompanyLink" href="../../">ООО «ТИТАН АВТО»</a>'+
    '<p class="contact-tagline">Автомобили с пробегом</p></div></div>'+
    '<a class="contactBrandLogo" href="../../" aria-label="ТИТАН АВТО — главная">'+
    '<img src="../../assets/brand/titan-auto-logo.svg" alt="ТИТАН АВТО"></a></div>';
  return head+'<body><main class="wrap wrap--contactsPage"><div><article class="card"><div class="card__body">'+
    '<div class="contactSheet">'+hero+actions+contactMethods(m)+tail;
}
function vcard(m) {
  const original = originalCardFile(m, 'contact.vcf');
  if (original) return original;
  const v = s => s.replace(/[\\,;]/g,'\\$&').replace(/\r?\n/g,'\\n');
  return ['BEGIN:VCARD','VERSION:3.0','N:'+v(m.name)+';;;;','FN:'+v(m.name),'ORG:ТИТАН АВТО','TITLE:'+v(m.role),'TEL;TYPE=WORK,VOICE:'+m.phone,...(m.email?['EMAIL:'+m.email]:[]),'END:VCARD',''].join('\r\n');
}
function httpsLink(raw, hosts) {
  if (!raw) return true;
  try { const u = new URL(raw); return u.protocol==='https:' && !u.username && !u.password && (!hosts || hosts.includes(u.hostname)); } catch { return false; }
}
function validate(form, slug) {
  const m = {slug};
  for (const k of Object.keys(fields)) m[k] = String(form.get(k) || '').trim();
  m.phone = m.phone.replace(/[\s()-]/g,'');
  if (!m.name || !m.role || m.name.length>100 || m.role.length>150 || m.bio.length>1000 ||
      Object.values(m).some(v=>v.length>1000 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v)) ||
      (m.phone && !/^\+[1-9]\d{6,14}$/.test(m.phone)) ||
      (m.email && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(m.email)) ||
      !httpsLink(m.telegram,['t.me']) || !httpsLink(m.channel,['t.me']) ||
      !httpsLink(m.max,['max.ru','web.max.ru']) ||
      !(httpsLink(m.photo) || /^(?:assets\/images\/|managers\/assets\/)(?!.*\.\.)[\w/.-]+\.(?:png|jpe?g|webp)$/i.test(m.photo))) {
    throw Error('Проверьте обязательные поля, формат телефона и ссылки.');
  }
  return m;
}

function update(action, slug, inputs) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 60 ||
      [legacy, 'assets'].includes(slug)) throw Error('Недопустимый адрес визитки.');
  const index = team.findIndex(member => member.slug === slug);
  if (action === 'delete') {
    if (index < 0) throw Error('Сотрудник не найден.');
    team.splice(index, 1);
  } else {
    if (action === 'add' && (index >= 0 || team.length >= 10)) {
      throw Error('Адрес занят или все 10 мест заполнены.');
    }
    if (action === 'edit' && index < 0) throw Error('Сотрудник не найден.');
    if (!['add', 'edit'].includes(action)) throw Error('Неизвестное действие.');

    const previous = team[index];
    const form = new URLSearchParams();
    for (const field of Object.keys(fields)) {
      const input = String(inputs[field] || '').trim();
      form.set(field, input === '-' ? '' : input || previous?.[field] || '');
    }
    const member = validate(form, slug);
    if (previous && Object.keys(fields).every(key => (previous[key] || '') === member[key])) return;
    if (previous) team[index] = member;
    else team.push(member);
  }
  fs.writeFileSync(teamFile, JSON.stringify(team, null, 2) + '\n');
}

function build(destination) {
  if (fs.existsSync(destination)) throw Error('Выберите новую папку для сборки.');
  const write = (file, contents) => {
    const target = path.join(destination, file);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, contents);
  };
  for (const folder of ['assets', 'managers/assets', 'managers/' + legacy]) {
    fs.cpSync(folder, path.join(destination, folder), {recursive: true});
  }
  write('index.html', landing());
  write('managers/index.html', directory());
  write('assets/site-common.js', picker());
  for (const member of list()) {
    write('managers/' + member.slug + '/index.html', card(member));
    write('managers/' + member.slug + '/contact.vcf', vcard(member));
  }
}

const inputs = process.env.TEAM_INPUTS ? JSON.parse(process.env.TEAM_INPUTS) : {};
if (inputs.action && inputs.action !== 'publish') update(inputs.action, (inputs.slug || '').trim(), inputs);
build(process.argv[2] || '_site');

