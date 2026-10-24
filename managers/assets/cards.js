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
  document.querySelector('[data-share]')?.addEventListener('click', async () => {
    const url = document.querySelector('link[rel="canonical"]').href;
    if (navigator.share) {
      try { await navigator.share({ title:document.title, url }); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    if (await copy(url)) announce('Ссылка на визитку скопирована');
    else window.prompt('Скопируйте ссылку на визитку', url);
  });
  const dialog = document.getElementById('max-dialog');
  let phone = '';
  document.querySelectorAll('[data-max]').forEach(button => {
    button.addEventListener('click', () => {
      phone = button.dataset.max;
      document.getElementById('max-phone').textContent = phone;
      dialog.showModal();
    });
  });
  document.getElementById('copy-phone')?.addEventListener('click', async () => {
    if (await copy(phone)) announce('Номер скопирован — добавьте его в контакты');
    else window.prompt('Скопируйте номер для MAX', phone);
  });
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
})();
