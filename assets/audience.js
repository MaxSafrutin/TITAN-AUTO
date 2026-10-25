'use strict';
(() => {
  const content = {
    seller: {
      label:'Вы продаёте автомобиль', title:'Ваш автомобиль — <span>в надёжных руках.</span>', subtitle:'Выгодно. Быстро. Безопасно.',
      text:'Помогаем продать автомобиль на понятных условиях. Берём на себя объявления, обращения, показы и сопровождение сделки — вы знаете условия и сохраняете право решения.', cta:'Продать сейчас',
      benefits:[
        ['Понятная фиксированная комиссия','Заранее обсудим комиссию и сумму, которую вы получите. Без скрытых платежей и дополнительных расходов.'],
        ['Реклама за наш счёт','Размещаем и продвигаем автомобиль, следим за обращениями и актуальностью объявлений. Вам не нужно отдельно платить за продвижение.'],
        ['Ваш автомобиль знают лично','Небольшая площадка и настоящая команда: принимаем обращения, организуем показы и ведём переговоры.'],
        ['Экономия вашего времени','Не нужно отвечать на каждый звонок и подстраивать день под просмотры. Менеджер согласует с вами важные решения.'],
        ['Бесплатная стоянка и оформление','Не берём отдельную плату за нахождение автомобиля на территории и подготовку документов к сделке.'],
        ['Решение остаётся за вами','Условия и цена согласовываются заранее. Мы помогаем продать, а не навязываем решения.']
      ],
      process:[
        ['Знакомство с менеджером','Расскажите об автомобиле и ожиданиях. Обсудим возможный формат работы и согласуем осмотр.'],
        ['Оценка и договорённости','Проверим состояние и документы, предложим цену и открыто объясним комиссию, расходы и порядок расчёта.'],
        ['Подготовка и продажа','Сделаем материалы, разместим объявления, ответим покупателям и организуем показы. Решения по цене согласуем с вами.'],
        ['Сделка и расчёт','Подготовим документы, согласуем способ оплаты и сроки передачи денег до подписания договора.']
      ],
      service:[
        ['Проверка документов','Внимательно проверяем документы автомобиля и участников сделки, помогаем корректно оформить продажу.'],
        ['Больше вариантов для покупателя','Покупателю можем помочь с кредитом или обменом. Условия обсуждаются индивидуально — это расширяет возможности продажи.'],
        ['Понятные сроки расчёта','При наличном расчёте передача денег возможна в течение дня; при кредите сроки зависят от банковских расчётов. Всё согласуем заранее.'],
        ['Уход за автомобилем','Охраняемая стоянка и внимание к состоянию автомобиля перед показами.']
      ],
      faq:[
        ['Сколько стоит работа с вами?','Комиссия фиксируется в договорённостях до начала работы. Менеджер объяснит итоговую сумму и условия — без мелкого шрифта.'],
        ['За какое время продастся автомобиль?','Для ликвидных автомобилей при рекомендованных настройках продажи наш ориентир — около двух недель. Это статистика, а не обещание срока для каждого автомобиля.'],
        ['Нужно ли самому ездить на показы?','Обращения и показы берём на себя. Важные решения и условия сделки согласуем с вами.'],
        ['Как приехать на оценку?','Выберите менеджера, предупредите минимум за два часа и дождитесь подтверждения времени перед выездом. Осмотры бывают выездными, поэтому встречу лучше согласовать.']
      ], contactIntro:'Выберите менеджера, расскажите об автомобиле и договоритесь об оценке. Мы объясним формат работы до того, как вы примете решение.'
    },
    buyer: {
      label:'Вы покупаете автомобиль', title:'Автомобиль с пробегом — <span>с уверенностью в выборе.</span>', subtitle:'Без переплат. Под ключ. Вся РФ.',
      text:'Помогаем разобраться в автомобиле, документах и условиях покупки. От первого вопроса до передачи ключей — с вашим менеджером. Для покупателей из других регионов обсудим организацию сделки индивидуально.', cta:'Купить сейчас',
      benefits:[
        ['Понятная полная стоимость','До сделки обсудим цену автомобиля и все выбранные услуги. Никаких обязательных дополнительных покупок и навязанных страховок.'],
        ['Подробности до визита','В закрытых каналах — фото, видеообзоры и описание автомобиля. У каждой публикации свой менеджер: можно задать вопросы напрямую.'],
        ['Живой контакт со специалистом','Менеджер расскажет об автомобиле, уточнит ваши вопросы и организует показ в согласованное время.'],
        ['Документы и оформление','Проверяем документы автомобиля и участников сделки, помогаем с договором и документами для регистрации.'],
        ['Выбор способа покупки','Можно обсудить наличный и безналичный расчёт, кредит или обмен с доплатой. Конкретные условия согласуем заранее.'],
        ['Покупка из другого региона','Обсудим материалы для знакомства с автомобилем и организацию сделки. Логистику, стоимость и сроки согласуем отдельно.']
      ],
      process:[
        ['Выберите автомобиль или менеджера','В открытых каналах смотрите новые поступления, в закрытых — подробности. Если уже нашли автомобиль, напишите менеджеру из публикации.'],
        ['Уточните детали до поездки','Спросите о состоянии, документах, комплектации и полной стоимости. Менеджер подтвердит актуальность предложения и наличие автомобиля.'],
        ['Согласуйте удобный показ','Предупредите минимум за два часа и дождитесь подтверждения. Так автомобиль и менеджер будут готовы к вашему приезду.'],
        ['Оформите покупку','Обсудим расчёт, подготовим документы и согласуем передачу автомобиля. Если вы из другого региона, заранее обсудим удобный порядок действий.']
      ],
      service:[
        ['Никаких навязанных услуг','Дополнительные услуги и страхование выбираете вы. Сначала обсуждаем условия — затем принимаете решение.'],
        ['Кредит и обмен','Наши специалисты помогут рассмотреть варианты кредита, а менеджер — возможность обмена с доплатой. Решение и условия зависят от конкретной сделки.'],
        ['Удобный способ расчёта','Наличные, перевод или расчёт по счёту: заранее обсудим подходящий вариант и порядок передачи автомобиля.'],
        ['Сопровождение сделки','Менеджер помогает пройти путь от вопросов об автомобиле до документов и выдачи. Условия для других регионов согласовываем лично.']
      ],
      faq:[
        ['Есть ли обязательные доплаты?','Не навязываем страховки и дополнительные услуги. До сделки менеджер объяснит полную стоимость выбранного варианта покупки.'],
        ['Как узнать больше об автомобиле?','Откройте закрытый канал: там подробные материалы по опубликованным автомобилям и контакт ответственного менеджера. Он ответит на дополнительные вопросы.'],
        ['Можно купить из другого региона?','Да, обсудите с менеджером, как познакомиться с автомобилем и организовать сделку. Расходы на дорогу или доставку и сроки согласовываются отдельно.'],
        ['Можно приехать без звонка?','Лучше согласовать показ заранее — минимум за два часа. Менеджер подтвердит наличие автомобиля и время, чтобы вы не приехали зря.']
      ], contactIntro:'Уже выбрали автомобиль? Свяжитесь с менеджером из публикации. Пока присматриваетесь — выберите специалиста, задайте вопросы и согласуйте показ.'
    }
  };
  const dialog=document.getElementById('audience-dialog');
  const experience=document.getElementById('experience');
  const renderCards=items=>items.map(([title,text])=>`<article><h3>${title}</h3><p>${text}</p></article>`).join('');
  function openChoice(){
    document.body.classList.add('audience-pending');
    window.TitanDialogs.open(dialog);
  }
  function choose(mode){
    const copy=content[mode];
    document.querySelector('[data-role-label]').textContent=copy.label;
    document.querySelector('[data-hero-title]').innerHTML=copy.title;
    document.querySelector('[data-hero-subtitle]').textContent=copy.subtitle;
    document.querySelector('[data-hero-text]').textContent=copy.text;
    document.querySelector('[data-hero-cta]').textContent=copy.cta;
    document.querySelector('[data-benefits]').innerHTML=renderCards(copy.benefits);
    document.querySelector('[data-process]').innerHTML=copy.process.map(([title,text])=>`<li><div><h3>${title}</h3><p>${text}</p></div></li>`).join('');
    document.querySelector('[data-service]').innerHTML=renderCards(copy.service);
    document.querySelector('[data-faq]').innerHTML=renderCards(copy.faq);
    document.querySelector('[data-contact-intro]').textContent=copy.contactIntro;
    document.body.dataset.audience=mode;
    experience.hidden=false;
    window.TitanDialogs.close(dialog);
    document.body.classList.remove('audience-pending');
    document.querySelectorAll('.landing-disclosure[open]').forEach(node=>node.open=false);
    window.scrollTo({top:0,behavior:'instant'});
    document.querySelector('[data-change-audience]').focus({preventScroll:true});
    // Honour direct section links only after the visitor has chosen a role.
    if(location.hash&&location.hash!=='#hero')openSection(location.hash);
  }
  dialog.close();
  openChoice();
  dialog.addEventListener('cancel',event=>event.preventDefault());
  document.querySelectorAll('[data-audience]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.audience)));
  document.querySelector('[data-change-audience]').addEventListener('click',openChoice);
  const disclosures=[...document.querySelectorAll('.landing-disclosure')];
  let pendingScroll=0;
  function align(node){
    cancelAnimationFrame(pendingScroll);
    pendingScroll=requestAnimationFrame(()=>{
      const header=document.querySelector('.site-header');
      const top=node.getBoundingClientRect().top+window.scrollY-header.getBoundingClientRect().height-12;
      window.scrollTo({top:Math.max(0,top),behavior:'instant'});
    });
  }
  function activate(node){
    disclosures.forEach(other=>{if(other!==node)other.open=false;});
    node.open=true;
    align(node);
  }
  function openSection(hash){
    let section;
    try{section=document.querySelector(hash);}catch{return;}
    const node=section?.querySelector('.landing-disclosure');
    if(node)activate(node);
  }
  disclosures.forEach(node=>{
    node.querySelector('summary').addEventListener('click',event=>{
      event.preventDefault();
      if(node.open){node.open=false;align(node);}else activate(node);
    });
  });
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link)return;
    const hash=link.getAttribute('href');
    if(hash==='#hero'){event.preventDefault();history.replaceState(null,'',hash);window.scrollTo({top:0,behavior:'instant'});return;}
    if(document.querySelector(hash)?.querySelector('.landing-disclosure')){
      event.preventDefault();history.replaceState(null,'',hash);openSection(hash);
    }
  });
  // The browser back/forward cache can restore a page without a new script run.
  window.addEventListener('pageshow',event=>{if(event.persisted&&!dialog.open)openChoice();});
})();
