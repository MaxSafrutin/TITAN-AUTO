'use strict';
(() => {
  const status = document.getElementById('status');
  let timer;
  const announce = text => {
    status.textContent = text;
    status.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(() => { status.hidden = true; }, 4000);
  };
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;top:0;left:-9999px';
      document.body.append(field);
      field.select();
      let success = false;
      try { success = document.execCommand('copy'); } catch { /* Manual fallback below. */ }
      field.remove();
      return success;
    }
  }
  const shareButton = document.querySelector('[data-share]');
  if (shareButton) {
    const managerName = document.querySelector('.contactName').textContent.trim().split(/\s+/)[0];
    const url = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
    const greeting = 'Здравствуйте! Только что общались.';
    const intro = 'Это моя персональная карточка менеджера ТИТАН АВТО';
    const instruction = 'Откройте ссылку и нажмите «Сохранить контакт», чтобы мой номер остался в телефоне.';
    const signature = managerName + '\nТИТАН АВТО';
    const text = greeting + '\n\n' + intro + '.\n\nЗдесь мои контакты, мессенджеры и информация о компании.\n\n' + instruction + '\n\n' + signature;
    const fullText = text.replace('информация о компании.', 'информация о компании:\n' + url);
    const smsText = greeting + '\n\n' + intro + ':\n' + url + '\n\n' + instruction + '\n\n' + signature;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const menu = document.createElement('dialog');
    menu.id = 'share-dialog';
    menu.className = 'site-dialog';
    menu.setAttribute('aria-labelledby', 'share-title');
    menu.innerHTML = '<button class="site-dialog-close" type="button" data-close-share aria-label="Закрыть">×</button><h2 id="share-title">Поделиться контактами</h2><div class="modalActions"><a class="modalAction" data-share-sms>Отправить по SMS</a><button class="modalAction" type="button" data-copy-link>Скопировать ссылку</button><button class="modalAction" type="button" data-copy-text>Скопировать текст и ссылку</button></div>';
    menu.querySelector('[data-share-sms]').href = 'sms:' + (isIOS ? '&' : '?') + 'body=' + encodeURIComponent(smsText);
    document.body.append(menu);
    menu.querySelector('[data-close-share]').addEventListener('click', () => window.TitanDialogs.close(menu));
    async function copyAndNotify(value, message) {
      if (await copy(value)) {
        window.TitanDialogs.close(menu);
        announce(message);
      } else window.prompt('Скопируйте текст', value);
    }
    menu.querySelector('[data-copy-link]').addEventListener('click', () => copyAndNotify(url, 'Ссылка скопирована'));
    menu.querySelector('[data-copy-text]').addEventListener('click', () => copyAndNotify(fullText, 'Текст и ссылка скопированы'));
    shareButton.addEventListener('click', async () => {
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({title: 'Контакты ' + managerName + ' | ТИТАН АВТО', text, url});
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
          console.error('Не удалось поделиться контактами', error);
        }
      }
      window.TitanDialogs.open(menu, shareButton);
    });
  }
  const materials = document.getElementById('materials-dialog');
  const mainPanel = document.querySelector('[data-materials-main]');
  const channelsPanel = document.querySelector('[data-channels-panel]');
  const backButton = document.querySelector('[data-channels-back]');
  const title = document.getElementById('materials-title');
  function showChannels(open) {
    mainPanel.hidden = open;
    channelsPanel.hidden = !open;
    backButton.hidden = !open;
    title.textContent = open ? 'Наши каналы' : 'Материалы о компании';
  }
  document.querySelector('[data-open-materials]')?.addEventListener('click', () => {
    showChannels(false);
    window.TitanDialogs.open(materials);
  });
  document.querySelector('[data-close-materials]')?.addEventListener('click', () => window.TitanDialogs.close(materials));
  document.querySelector('[data-open-channels]')?.addEventListener('click', () => {
    showChannels(true);
    backButton.focus();
  });
  backButton?.addEventListener('click', () => {
    showChannels(false);
    document.querySelector('[data-open-channels]').focus();
  });
})();
