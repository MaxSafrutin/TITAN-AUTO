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
    const phoneLink = document.querySelector('.contactMethod__number[href^="tel:"]');
    const phone = phoneLink.textContent.trim() || phoneLink.getAttribute('href').slice(4);
    const text = 'Здравствуйте! Только что общались по телефону..\n\nМои контакты и вся подробная информация о компании по ссылке:\n\nРад содействовать по любым вопросам, связанным с покупкой или продажей автомобиля с пробегом!\n↓';
    const fullText = text.replace('по ссылке:\n', 'по ссылке:\n' + url + '\n');
    const smsText = 'Здравствуйте! Сейчас общались..\n\nОставляю свой номер телефона для связи:\n' + phone + '\n\nБуду рад содействовать по любым вопросам, связанным с покупкой или продажей автомобиля с пробегом!\n\nС уважением, ' + managerName + ' | ТИТАН АВТО\nСамара, Мирная, 3к1';
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const menu = document.createElement('dialog');
    menu.id = 'share-dialog';
    menu.className = 'site-dialog share-dialog';
    menu.setAttribute('aria-labelledby', 'share-title');
    menu.innerHTML = '<button class="site-dialog-close" type="button" data-close-share aria-label="Закрыть">×</button><h2 id="share-title">Поделиться контактами</h2><div class="modalActions" data-share-options><button class="modalAction" type="button" data-share-electronic>Электронно</button><button class="modalAction" type="button" data-share-sms-option>По SMS</button></div><div data-electronic-panel hidden><p class="site-dialog-hint">Скопируйте текст и ссылку, чтобы отправить их в нужном приложении.</p><button class="modalAction" type="button" data-copy-text>Скопировать текст и ссылку</button></div><div data-sms-panel hidden><p class="site-dialog-hint">Откройте приложение SMS и выберите получателя. Если текст не подставится, скопируйте его и вставьте вручную. Сообщение отправляете вы.</p><div class="modalActions"><a class="modalAction" data-share-sms>Открыть SMS</a><button class="modalAction" type="button" data-copy-sms>Скопировать SMS</button></div></div><button class="modalBack share-back" type="button" data-share-back hidden>Назад</button>';
    menu.querySelector('[data-share-sms]').href = 'sms:' + (isIOS ? '&' : '?') + 'body=' + encodeURIComponent(smsText);
    document.body.append(menu);
    const options = menu.querySelector('[data-share-options]');
    const electronic = menu.querySelector('[data-electronic-panel]');
    const sms = menu.querySelector('[data-sms-panel]');
    const back = menu.querySelector('[data-share-back]');
    function showPanel(panel) {
      options.hidden = !!panel;
      electronic.hidden = panel !== electronic;
      sms.hidden = panel !== sms;
      back.hidden = !panel;
      (panel?.querySelector('a, button') || options.querySelector('button')).focus();
    }
    menu.querySelector('[data-close-share]').addEventListener('click', () => window.TitanDialogs.close(menu));
    back.addEventListener('click', () => showPanel(null));
    async function copyAndNotify(value, message) {
      if (await copy(value)) {
        window.TitanDialogs.close(menu);
        announce(message);
      } else window.prompt('Скопируйте текст', value);
    }
    menu.querySelector('[data-copy-text]').addEventListener('click', () => copyAndNotify(fullText, 'Текст и ссылка скопированы'));
    menu.querySelector('[data-copy-sms]').addEventListener('click', () => copyAndNotify(smsText, 'Текст SMS скопирован'));
    menu.querySelector('[data-share-sms-option]').addEventListener('click', () => showPanel(sms));
    menu.querySelector('[data-share-electronic]').addEventListener('click', async () => {
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({title: 'Контакты ' + managerName + ' | ТИТАН АВТО', text, url});
          window.TitanDialogs.close(menu);
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
          console.error('Не удалось поделиться контактами', error);
        }
      }
      showPanel(electronic);
    });
    shareButton.addEventListener('click', () => {
      showPanel(null);
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
