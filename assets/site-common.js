'use strict';
(() => {
  const root = new URL('../', document.currentScript.src);
  const url = path => new URL(path, root).href;
  const managers = [
    {slug:'aleksandr-belyaev', name:'Беляев Александр', phone:'+79372322270', display:'+7 (937) 232-22-70', photo:'assets/images/team/aleksandr-ambassador.webp', max:'81584412', telegramUrl:'https://t.me/+WhiHgjMCvYJlMmIy'},
    {slug:'aleksey-volgin', name:'Волгин Алексей', phone:'+79279003844', display:'+7 (927) 900-38-44', photo:'managers/assets/titan-avatar.jpg', max:'320122708', telegram:true},
    {slug:'nikita-kochetov', name:'Кочетов Никита', phone:'+79397163222', display:'+7 (939) 716-32-22', photo:'assets/images/team/nikita-kochetov.png', max:'3181851', telegram:true},
    {slug:'maksim-safrutin', name:'Сафрутин Максим', phone:'+79276522287', display:'+7 (927) 652-22-87', photo:'managers/assets/maksim-safrutin.png', max:'395018481', telegram:true}
  ];
  const external = 'target="_blank" rel="noopener noreferrer"';
  const registered = new WeakSet();
  const openers = new WeakMap();
  function register(node) {
    if (registered.has(node)) return;
    registered.add(node);
    node.classList.add('site-dialog');
    node.addEventListener('click', event => {
      const r = node.getBoundingClientRect();
      if (node.dataset.required !== 'true' && event.target === node &&
          (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) node.close();
    });
    node.addEventListener('cancel', event => {
      if (node.dataset.required === 'true') event.preventDefault();
    });
    node.addEventListener('close', () => {
      syncScroll();
      const opener = openers.get(node);
      if (!document.querySelector('dialog[open]') && opener?.isConnected) opener.focus({preventScroll:true});
    });
  }
  const dialogs = {
    open(node, opener = document.activeElement) {
      register(node);
      openers.set(node, opener);
      if (!node.open) node.showModal();
      node.scrollTop = 0;
      syncScroll();
    },
    close(node) { node.close(); syncScroll(); }
  };
  window.TitanDialogs = dialogs;
  function dialog(id, title, content) {
    const node = document.createElement('dialog');
    node.id = id;
    node.className = 'site-dialog';
    node.setAttribute('aria-labelledby', `${id}-title`);
    node.innerHTML = `<button class="site-dialog-close" type="button" data-dialog-close aria-label="Закрыть">×</button><h2 id="${id}-title">${title}</h2>${content}`;
    document.body.append(node);
    node.querySelector('[data-dialog-close]').addEventListener('click', () => node.close());
    register(node);
    return node;
  }
  function syncScroll() { document.body.classList.toggle('site-dialog-open', !!document.querySelector('dialog[open]')); }
  const directory = dialog('manager-picker', 'Выберите своего менеджера', `<p class="site-dialog-lead">Обсудите задачу и согласуйте встречу. Если автомобиль уже выбран, обратитесь к менеджеру, указанному в его публикации.</p><div class="picker-list">${managers.map(m=>`<article class="picker-card"><img src="${url(m.photo)}" alt="${m.name}" width="64" height="64"><div><h3>${m.name}</h3><a href="tel:${m.phone}">${m.display}</a></div><div class="picker-actions"><a class="site-button" href="${url('managers/'+m.slug+'/')}">Визитка и контакты ↗</a></div></article>`).join('')}</div>`);
  const directions = dialog('directions-picker', 'Как нас найти', `<p class="site-dialog-lead"><strong>Самара, Мирная, 3к1.</strong> Здание бывшего ДЦ Toyota Центр. Вход с торца, напротив площадки с красными флагами ТИТАН АВТО. Второй этаж, третий кабинет от входа.</p><p class="visit-note">Пожалуйста, свяжитесь с менеджером минимум за два часа и дождитесь подтверждения встречи перед выездом. Ежедневно с 10:00 до 18:00; другое время — по договорённости.</p><div class="route-actions"><a class="site-button" href="https://yandex.ru/maps/?rtext=~53.240161%2C50.246780&amp;rtt=auto" ${external}>Маршрут в Яндекс Картах ↗</a><a class="site-button" href="https://www.google.com/maps/dir/?api=1&amp;destination=53.240161%2C50.246780&amp;travelmode=driving" ${external}>Маршрут в Google Картах ↗</a><a class="site-button" href="https://2gis.ru/samara/directions/points/%7C50.246744,53.240181;2533910445575503" ${external}>Маршрут в 2ГИС ↗</a></div><p class="site-dialog-hint">Начальную точку и доступ к геопозиции можно выбрать в приложении карт.</p>`);
  document.addEventListener('click', event => {
    const opener=event.target.closest('[data-open-managers], [data-open-directions]');
    if(!opener)return;
    event.preventDefault();
    dialogs.open(opener.hasAttribute('data-open-managers')?directory:directions, opener);
  });
  document.querySelectorAll('[data-menu-toggle]').forEach(button=>{
    const menu=document.getElementById(button.getAttribute('aria-controls'));
    const close=()=>{menu.hidden=true;button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Открыть меню');};
    button.addEventListener('click',()=>{menu.hidden=!menu.hidden;button.setAttribute('aria-expanded',String(!menu.hidden));button.setAttribute('aria-label',menu.hidden?'Открыть меню':'Закрыть меню');});
    menu.addEventListener('click',event=>{if(event.target.closest('a,button'))close();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){close();button.focus();}});
    document.addEventListener('click',event=>{if(!menu.contains(event.target)&&!button.contains(event.target))close();});
    window.matchMedia('(min-width: 801px)').addEventListener('change',close);
  });
})();
