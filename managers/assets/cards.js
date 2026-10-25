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
