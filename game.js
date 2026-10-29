(()=>{
'use strict';
const $ = id => document.getElementById(id);
const screens=['intro','quiz','catch','gifts','final'];
const state={
  qSection:1,
  q1Step:0,
  noCount:0,
  caught:0,
  lastHeart:0,
  giftOrder:[],
  opened:new Set()
};

const q1Steps=[
  {title:'Чи надад хайртай юу?', sub:'Зөв answer-аа бодоорой хэхэ 🤭', hero:'🥺'},
  {title:'Итгэлтэй байна уу?', sub:'Энэ important question шүү 😌', hero:'🫣'},
  {title:'Нээрээ юу?', sub:'Last chance to think carefully 😏', hero:'😚'},
  {title:'🥹❤️', sub:'За тэгвэл дараагийн асуулт руу оръё.', hero:'💞'}
];
const noTeases=[
  'Ээ хөөе 😂',
  'Дахиад оролдоод үз 😝',
  'Үгүй гэдэг товч зугтаад байна 💨',
  'Тийм нь улам том болоод байна шүү 🤭',
  'Чи угаасаа Тийм дарах ёстой 😌',
  'Catch me if you can 😼'
];

function resetQuestionButtons(){
  state.noCount = 0;
  const field = $('playfield');
  const yes = $('yesBtn');
  const no = $('noBtn');
  yes.style.scale = '1';
  no.style.scale = '1';
  yes.style.left = '10%';
  yes.style.top = '50%';
  no.style.left = '76%';
  no.style.top = '50%';
}

function growBtn(btn, count){
  const scale = Math.min(2.8, 1 + count*0.18);
  btn.style.scale = scale.toFixed(2);
}

function placeButtonRandom(btn){
  const field = $('playfield');
  const fw = field.clientWidth;
  const fh = field.clientHeight;
  const bw = btn.offsetWidth || 96;
  const bh = btn.offsetHeight || 52;
  const minX = bw/2 + 10;
  const maxX = Math.max(minX, fw - bw/2 - 10);
  const minY = bh/2 + 10;
  const maxY = Math.max(minY, fh - bh/2 - 10);
  const x = minX + Math.random() * (maxX - minX);
  const y = minY + Math.random() * (maxY - minY);
  btn.style.left = x + 'px';
  btn.style.top = y + 'px';
}

function evadeAndGrow(evadeBtn, growBtnEl, subText, evadeTexts){
  state.noCount++;
  if(subText) $('questionSub').textContent = subText[(state.noCount-1) % subText.length];
  if(evadeTexts) evadeBtn.textContent = evadeTexts[state.noCount % evadeTexts.length];
  growBtn(growBtnEl, state.noCount);
  placeButtonRandom(evadeBtn);
  if(navigator.vibrate) navigator.vibrate(15);
}

function show(screenId){
  screens.forEach(id => $(id).classList.toggle('active', id===screenId));
  window.scrollTo(0,0);
  if(screenId==='quiz') renderQuiz();
  if(screenId==='catch') resetCatch();
  if(screenId==='gifts') renderGifts();
  if(screenId==='final') celebrate();
}

function renderQuiz(){
  const title = $('questionTitle');
  const sub = $('questionSub');
  sub.classList.remove('hidden');
  const hero = $('quizHero');
  const nextBtn = $('nextQuestionBtn');
  const retryBtn = $('retryQuestionBtn');
  const field = $('playfield');
  const cat = $('catWrap');
  const yesBtn = $('yesBtn');
  const noBtn = $('noBtn');

  resetQuestionButtons();
  cat.classList.add('hidden');
  nextBtn.classList.add('hidden');
  retryBtn.classList.add('hidden');
  field.classList.remove('hidden');
  yesBtn.classList.remove('hidden');
  noBtn.classList.remove('hidden');

  if(state.qSection===1){
    const step = q1Steps[state.q1Step];
    title.textContent = step.title;
    sub.textContent = step.sub;
    hero.textContent = step.hero;
    yesBtn.textContent = state.q1Step < 2 ? 'Тийм 💗' : 'Тийм ээ 🥹';
    noBtn.textContent = 'Үгүй 🙈';

    if(state.q1Step===3){
      field.classList.add('hidden');
      nextBtn.classList.remove('hidden');
      nextBtn.textContent = '2-р асуулт ➜';
    }
  } else {
    title.textContent = 'Чи надад дургүй юм уу☹️';
    sub.textContent = 'Үнэнийг хэлээрэй... 👀';
    hero.textContent = '😶';
    yesBtn.textContent = 'Тийм... 😶';
    noBtn.textContent = 'Үгүй 😌';
    placeButtonRandom(yesBtn);
  }
}

function handleYes(){
  if(state.qSection===1){
    if(state.q1Step < 3){
      state.q1Step++;
      renderQuiz();
    }
    return;
  }

  evadeAndGrow(
    $('yesBtn'),
    $('noBtn'),
    ['Хмм? 😏','Үгүй гэж дар л даа 😌','Тэр товч чамаас зугтчихлаа 🤭','Зөв answer нь доор байгаа 😚'],
    ['Тийм... 😶','Nooo 😝','Баригдахгүй 😜']
  );
}

function handleNoClick(){
  if(state.qSection===1){
    evadeAndGrow(
      $('noBtn'),
      $('yesBtn'),
      noTeases,
      ['Үгүй 🙈','Nope 😝','Барьж чадахгүй 😜']
    );
    return;
  }
  state.noCount++;
  growBtn($('noBtn'), state.noCount);
  $('questionTitle').textContent = 'Худлаа ярь 😾';
  $('questionSub').textContent = '';
  $('questionSub').classList.add('hidden');
  $('quizHero').textContent = '😼';
  $('catWrap').classList.remove('hidden');
  $('playfield').classList.add('hidden');
  $('retryQuestionBtn').classList.remove('hidden');
  $('nextQuestionBtn').classList.remove('hidden');
  $('nextQuestionBtn').textContent = 'Дараагийн хэсэг ➜';
}

function nextQuiz(){
  if(state.qSection===1 && state.q1Step===3){
    state.qSection = 2;
    renderQuiz();
  } else {
    show('catch');
  }
}

function resetCatch(){
  state.caught = 0;
  $('bar').style.width = '0%';
  $('count').textContent = '0 / 5 💗';
  requestAnimationFrame(moveHeart);
}

function moveHeart(){
  const arena = $('heartArena');
  const heart = $('heartBtn');
  const maxX = Math.max(0, arena.clientWidth - heart.offsetWidth - 12);
  const maxY = Math.max(0, arena.clientHeight - heart.offsetHeight - 12);
  heart.style.left = 6 + Math.random() * maxX + 'px';
  heart.style.top = 6 + Math.random() * maxY + 'px';
  heart.textContent = ['💗','💖','💘','💕','❤️'][Math.floor(Math.random()*5)];
}

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function setupGifts(){
  state.giftOrder = shuffle(['letter','image','empty']);
  state.opened = new Set();
}

function renderGifts(){
  const grid = $('giftGrid');
  grid.innerHTML = '';
  state.giftOrder.forEach((type,idx)=>{
    const btn = document.createElement('button');
    btn.className = 'gift' + (state.opened.has(idx) ? ' opened' : '');
    btn.innerHTML = state.opened.has(idx) ? '🎉<small>Opened</small>' : '🎁<small>Tap me</small>';
    btn.addEventListener('click', ()=>openGift(idx,type));
    grid.appendChild(btn);
  });
  updateGiftStatus();
}

function updateGiftStatus(){
  $('giftStatus').textContent = `${state.opened.size} / 3 бэлэг нээгдсэн`;
  if(state.opened.size===0){
    $('giftHint').textContent = 'Нэгийг нь дараад surprise-аа үзээрэй 💌';
    $('finalBtn').classList.add('hidden');
  } else if(state.opened.size<3){
    $('giftHint').textContent = 'Буцаад үлдсэн бэлгүүдийг ч бас нээж болно 😚';
    $('finalBtn').classList.remove('hidden');
    $('finalBtn').textContent = 'Сүүлчийн зурвас 💞';
  } else {
    $('giftHint').textContent = 'Бүгдийг нь нээчихлээ 😭💗';
    $('finalBtn').classList.remove('hidden');
    $('finalBtn').textContent = 'Final surprise 💌';
  }
}

function openGift(idx,type){
  state.opened.add(idx);
  renderGifts();

  const title = $('modalTitle');
  const body = $('modalBody');
  if(type==='letter'){
    title.textContent = '1-р surprise · Захиа 💌';
    body.innerHTML = `<div class="letter-box">Хайртай шүү. 💗</div>`;
  } else if(type==='image'){
    title.textContent = '2-р surprise · Салаавч 😆';
    body.innerHTML = `<div class="image-box"><img src="surprise.jpg" alt="Special surprise image" style="display:block;width:100%;max-width:320px;margin:0 auto;border-radius:18px;border:2px solid #f3c8d8;box-shadow:0 10px 24px #ebb8cc55"></div>`;
  } else {
    title.textContent = '3-р surprise · Хоосон хайрцаг 😆';
    body.innerHTML = `<div class="empty-box"><div style="font-size:56px;margin-bottom:8px">📦</div><p><b>Энэ бэлэг хоосон байжээ 🤭</b></p><p class="small">Гэхдээ санаа зоволтгүй... миний чамд өгөх хайр бол хоосон биш шүү 😌💗</p></div>`;
  }
  $('giftModal').classList.add('show');
  $('giftModal').setAttribute('aria-hidden','false');
}

function closeModal(){
  $('giftModal').classList.remove('show');
  $('giftModal').setAttribute('aria-hidden','true');
}

function celebrate(){
  if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for(let i=0;i<12;i++){
    const el=document.createElement('span');
    el.className='confetti';
    el.textContent=['💗','💖','✨','💕','🌸'][i%5];
    el.style.left=(10+Math.random()*80)+'vw';
    el.style.top=(20+Math.random()*55)+'vh';
    el.style.setProperty('--x',(Math.random()*400-200)+'px');
    el.style.setProperty('--y',(Math.random()*500-250)+'px');
    document.body.append(el);
    setTimeout(()=>el.remove(),2700);
  }
}

function replay(){
  state.qSection = 1;
  state.q1Step = 0;
  state.noCount = 0;
  resetQuestionButtons();
  setupGifts();
  closeModal();
  show('intro');
}

$('startBtn').addEventListener('click', ()=>show('quiz'));
$('yesBtn').addEventListener('click', handleYes);
$('noBtn').addEventListener('click', handleNoClick);
$('retryQuestionBtn').addEventListener('click', ()=>{ if(state.qSection===2) renderQuiz(); });
$('nextQuestionBtn').addEventListener('click', nextQuiz);
$('heartBtn').addEventListener('pointerdown', e=>{
  e.preventDefault();
  if(Date.now() - state.lastHeart < 150) return;
  state.lastHeart = Date.now();
  state.caught++;
  $('bar').style.width = (state.caught*20) + '%';
  $('count').textContent = `${state.caught} / 5 💗`;
  if(navigator.vibrate) navigator.vibrate(20);
  if(state.caught >= 5){
    $('count').textContent = 'Барилаа! 😭💗';
    setTimeout(()=>show('gifts'), 420);
  } else {
    moveHeart();
  }
});
$('closeModalBtn').addEventListener('click', closeModal);
$('giftModal').addEventListener('click', e=>{ if(e.target === $('giftModal')) closeModal(); });
$('finalBtn').addEventListener('click', ()=>show('final'));
$('replayBtn').addEventListener('click', replay);


setupGifts();
})();
